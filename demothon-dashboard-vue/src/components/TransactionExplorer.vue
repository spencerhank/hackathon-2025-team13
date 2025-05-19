<template>
  <v-sheet rounded="lg">
    <v-row class="pl-5">
      <v-col cols="9"
        ><v-btn
          :disabled="!transactionTrackerStore.isTransactionReceiverUp"
          :color="btnColor"
          @click="transactionTrackerStore.toggleShowTransactions()"
        >
          {{ btnText }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="transactionTrackerStore.showTransactions" class="pl-5">
      <v-col cols="12">
        <div class="font-weight-bold pa-2">Messages Received</div>
        <v-virtual-scroll
          ref="transactionScroller"
          :height="200"
          :items="transactionTopics"
        >
          <template v-slot:default="{ item }">
            <v-list-item>
              <v-list-item-subtitle>
                <span class="text-disabled font-weight-bold text-wrap">
                  {{ item }}</span
                >
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script setup>
import { ref } from "vue";
import { useTransactionTrackerStore } from "@/stores/transactionTrackerStore";

const transactionScroller = ref(null);

const transactionTrackerStore = useTransactionTrackerStore();
const transactionTopics = computed(() => {
  let tts = [];
  transactionTrackerStore.transactions.forEach((transaction) => {
    tts.push(transaction.getDestination().getName());
  });
  return tts;
});

const btnColor = computed(() => {
  if (transactionTrackerStore.showTransactions) {
    return "red";
  } else {
    return "green";
  }
});

const btnText = computed(() => {
  if (transactionTrackerStore.showTransactions) {
    return "Hide Transaction Topics";
  } else {
    return "Show Transaction Topics";
  }
});

watch(
  () => transactionTopics.value,
  () => {
    scrollToBottom();
  }
);

function scrollToBottom() {
  if (transactionScroller.value) {
    nextTick(() => {
      transactionScroller.value.scrollToIndex(
        transactionTopics.value.length - 1
      );
    });
  }
}
</script>
