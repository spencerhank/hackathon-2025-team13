<template>
  <v-sheet rounded="lg">
    <v-col cols="12">
      <div class="font-weight-bold pa-2">Retail 360 Insights</div>
      <v-virtual-scroll
        ref="chatScroller"
        :height="500"
        :items="llmResponseItems"
      >
        <template v-slot:default="{ item }">
          <v-list-item>
            <v-list-item-title>
              <span class="font-weight-bold">{{ item.question }}</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              <span class="text-primary">{{ item.answer }}</span>
            </v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-virtual-scroll>
      <v-text-field
        v-if="!searchInputDisabled"
        density="compact"
        label="Search"
        rounded="lg"
        variant="solo-filled"
        single-line
        v-model="searchInput"
        ref="searchInputRef"
        :disabled="searchInputDisabled"
        append-inner-icon="mdi-magnify"
        @click:append-inner="submitSearch"
        class="pl-2"
        @keydown.enter="submitSearch"
      ></v-text-field>
      <div v-else class="d-flex align-center justify-center">
        <v-progress-circular
          indeterminate
          class="align-center"
        ></v-progress-circular>
      </div>
    </v-col>
  </v-sheet>
</template>

<script setup>
import { useSolaceStore } from "../stores/solaceStore";

const solaceStore = useSolaceStore();
const searchInput = ref("");
const searchInputDisabled = ref(true);
const llmResponseItems = ref([]);
const chatScroller = ref(null);
const replyCallbackDestination = ref(null);

solaceStore.connect().then(() => {
  solaceStore
    .createTempReplyConsumer(
      "AcmeRetail_Retail360_RAGInsights_CB",
      searchReplyCallback
    )
    .then((replyCBDestination) => {
      console.log("Reply CB Destination" + replyCBDestination);
      replyCallbackDestination.value = replyCBDestination;
      searchInputDisabled.value = false;
    });
});

function submitSearch() {
  searchInputDisabled.value = true;
  const searchQuestion = searchInput.value;
  const response = {
    question: searchQuestion,
    answer: "",
  };
  llmResponseItems.value.push(response);
  searchInput.value = "";
  scrollToBottom();
  solaceStore.sendRequest(
    "acmeRetail/retailInsights/rag/inquiry",
    replyCallbackDestination.value,
    { query: searchQuestion }
  );
}

function searchReplyCallback(message) {
  llmResponseItems.value[llmResponseItems.value.length - 1].answer = JSON.parse(
    message.getBinaryAttachment()
  ).content;
  searchInputDisabled.value = false;
  // scrollToBottom();
  console.log("Message: " + message.dump());
}

function scrollToBottom() {
  if (chatScroller.value) {
    nextTick(() => {
      chatScroller.value.scrollToIndex(llmResponseItems.value.length - 1);
    });
  }
}
</script>
