<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { Participant, SortField, SortOrder } from "./types";
import WinnersBlock from "./components/WinnersBlock.vue";
import RegisterForm from "./components/RegisterForm.vue";
import ParticipantsTable from "./components/ParticipantsTable.vue";
import SearchBar from "./components/SearchBar.vue";
import AppModal from "./components/AppModal.vue";
import AppButton from "./components/AppButton.vue";
import AppInput from "./components/AppInput.vue";

const participants = ref<Participant[]>([]);
const winnerIds = ref<string[]>([]);

const searchQuery = ref("");
const sortField = ref<SortField | null>(null);
const sortOrder = ref<SortOrder>("asc");

const isEditModalOpen = ref(false);
const editingParticipant = ref<Participant | null>(null);
const editName = ref("");
const editDateOfBirth = ref("");
const editEmail = ref("");
const editPhone = ref("");
const isEditSubmitted = ref(false);

const isDeleteModalOpen = ref(false);
const deletingParticipant = ref<Participant | null>(null);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

const todayDate = computed(() => new Date().toISOString().split("T")[0]);

onMounted(() => {
  const savedParticipants = localStorage.getItem("participants");
  if (savedParticipants) {
    try {
      participants.value = JSON.parse(savedParticipants);
    } catch {
      participants.value = [];
    }
  }

  const savedWinners = localStorage.getItem("lottery_winners");
  if (savedWinners) {
    try {
      winnerIds.value = JSON.parse(savedWinners);
    } catch {
      winnerIds.value = [];
    }
  }
});

watch(
  participants,
  (newVal) => {
    localStorage.setItem("participants", JSON.stringify(newVal));
  },
  { deep: true }
);

watch(
  winnerIds,
  (newVal) => {
    localStorage.setItem("lottery_winners", JSON.stringify(newVal));
  },
  { deep: true }
);

const winners = computed(() => {
  return winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => Boolean(p));
});

const canDrawWinner = computed(() => {
  if (winners.value.length >= 3) return false;
  const availableUsers = participants.value.filter(
    (p) => !winnerIds.value.includes(p.id)
  );
  return availableUsers.length > 0;
});

const handleDrawWinner = () => {
  if (!canDrawWinner.value) return;

  const availableUsers = participants.value.filter(
    (p) => !winnerIds.value.includes(p.id)
  );

  const randomIndex = Math.floor(Math.random() * availableUsers.length);
  const selectedWinner = availableUsers[randomIndex];
  winnerIds.value.push(selectedWinner.id);
};

const handleRemoveWinner = (id: string) => {
  winnerIds.value = winnerIds.value.filter((wId) => wId !== id);
};

const handleAddParticipant = (data: Omit<Participant, "id">) => {
  const newParticipant: Participant = {
    ...data,
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
  };
  participants.value.push(newParticipant);
};

const handleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

const handleFilter = (query: string) => {
  searchQuery.value = query;
};

const processedParticipants = computed(() => {
  let result = [...participants.value];

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (sortField.value) {
    result.sort((a, b) => {
      let fieldA = a[sortField.value!];
      let fieldB = b[sortField.value!];

      if (sortField.value === "name") {
        return sortOrder.value === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      if (sortField.value === "dateOfBirth") {
        const timeA = new Date(fieldA).getTime();
        const timeB = new Date(fieldB).getTime();
        return sortOrder.value === "asc" ? timeA - timeB : timeB - timeA;
      }

      return 0;
    });
  }

  return result;
});

const openEditModal = (participant: Participant) => {
  editingParticipant.value = participant;
  editName.value = participant.name;
  editDateOfBirth.value = participant.dateOfBirth;
  editEmail.value = participant.email;
  editPhone.value = participant.phone;
  isEditSubmitted.value = false;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingParticipant.value = null;
  isEditSubmitted.value = false;
};

const editNameError = computed(() => {
  if (!isEditSubmitted.value) return "";
  if (!editName.value.trim()) return "This value is required.";
  return "";
});

const editDateError = computed(() => {
  if (!isEditSubmitted.value) return "";
  if (!editDateOfBirth.value) return "This value is required.";
  if (editDateOfBirth.value > todayDate.value)
    return "Date cannot be in the future.";
  return "";
});

const editEmailError = computed(() => {
  if (!isEditSubmitted.value) return "";
  if (!editEmail.value.trim()) return "This value is required.";
  if (!emailRegex.test(editEmail.value.trim())) return "Invalid email format.";

  const isDuplicate = participants.value.some(
    (p) =>
      p.id !== editingParticipant.value?.id &&
      p.email.toLowerCase() === editEmail.value.trim().toLowerCase()
  );
  if (isDuplicate) return "Participant with this email already exists.";
  return "";
});

const editPhoneError = computed(() => {
  if (!isEditSubmitted.value) return "";
  if (!editPhone.value.trim()) return "This value is required.";
  if (!phoneRegex.test(editPhone.value.trim()))
    return "Invalid format. Use +380XXXXXXXXX.";
  return "";
});

const handleUpdateParticipant = () => {
  isEditSubmitted.value = true;

  if (
    editNameError.value ||
    editDateError.value ||
    editEmailError.value ||
    editPhoneError.value
  ) {
    return;
  }

  if (editingParticipant.value) {
    const index = participants.value.findIndex(
      (p) => p.id === editingParticipant.value!.id
    );
    if (index !== -1) {
      participants.value[index] = {
        ...editingParticipant.value,
        name: editName.value.trim(),
        dateOfBirth: editDateOfBirth.value,
        email: editEmail.value.trim(),
        phone: editPhone.value.trim(),
      };
    }
  }

  closeEditModal();
};

const openDeleteModal = (participant: Participant) => {
  deletingParticipant.value = participant;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deletingParticipant.value = null;
};

const handleConfirmDelete = () => {
  if (!deletingParticipant.value) return;

  const idToRemove = deletingParticipant.value.id;
  participants.value = participants.value.filter((p) => p.id !== idToRemove);
  winnerIds.value = winnerIds.value.filter((wId) => wId !== idToRemove);

  closeDeleteModal();
};
</script>

<template>
  <div class="container py-5 app-container">
    <WinnersBlock
      :winners="winners"
      :can-draw-winner="canDrawWinner"
      @draw-winner="handleDrawWinner"
      @remove-winner="handleRemoveWinner"
    />

    <RegisterForm :participants="participants" @submit="handleAddParticipant" />

    <div class="mb-3 d-flex justify-content-end">
      <div class="col-12 col-md-4">
        <SearchBar @filter-by-name="handleFilter" />
      </div>
    </div>

    <ParticipantsTable
      :participants="processedParticipants"
      :sort-field="sortField"
      :sort-order="sortOrder"
      @sort="handleSort"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <AppModal
      :is-open="isEditModalOpen"
      title="Редагувати дані учасника"
      @close="closeEditModal"
    >
      <template #body>
        <div class="mb-3">
          <label class="form-label fw-bold small">Name</label>
          <AppInput
            v-model="editName"
            placeholder="Enter user name"
            :error-message="editNameError"
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold small">Date of Birth</label>
          <AppInput
            v-model="editDateOfBirth"
            type="date"
            :max="todayDate"
            :error-message="editDateError"
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold small">Email</label>
          <AppInput
            v-model="editEmail"
            type="email"
            placeholder="Enter email"
            :error-message="editEmailError"
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold small">Phone number</label>
          <AppInput
            v-model="editPhone"
            placeholder="+380XXXXXXXXX"
            :error-message="editPhoneError"
          />
        </div>
      </template>
      <template #footer>
        <AppButton variant="secondary" @click="closeEditModal">
          Скасувати
        </AppButton>
        <AppButton @click="handleUpdateParticipant"> Оновити дані </AppButton>
      </template>
    </AppModal>

    <AppModal
      :is-open="isDeleteModalOpen"
      title="Підтвердження видалення"
      @close="closeDeleteModal"
    >
      <template #body>
        <p v-if="deletingParticipant">
          Ви дійсно бажаєте видалити учасника "{{ deletingParticipant.name }}",
          "{{ deletingParticipant.email }}"?
        </p>
      </template>
      <template #footer>
        <AppButton variant="secondary" @click="closeDeleteModal">
          Ні
        </AppButton>
        <AppButton variant="danger" @click="handleConfirmDelete">
          Так
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 820px;
}
</style>
