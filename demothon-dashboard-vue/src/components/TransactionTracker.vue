<template>
  <v-card :title="cardTitle">
    <span class="ml-5 font-weight-bold" :class="textColor"
      ><span v-if="isCurrency"> $ {{ trackedTransactions }} </span>
      <span v-else>{{ trackedTransactions }}</span>
    </span>
    <span class="text-muted-color"> {{ cardSuffix }}</span>
    <br />
    <div
      class="text-muted-color pl-5 pr-5 text-disabled"
      v-if="mostRecentTransaction && showTransactionState"
    >
      {{ getMostRecentTransactionTopic(mostRecentTransaction) }}
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  cardTitle: String,
  textColor: String,
  trackedTransactions: Number,
  mostRecentTransaction: Object,
  showTransactionState: Boolean,
  cardSuffix: String,
  isCurrency: String,
});

function getMostRecentTransactionTopic(mostRecentTransaction) {
  if (
    mostRecentTransaction !== null &&
    mostRecentTransaction.getDestination() !== null
  ) {
    return mostRecentTransaction.getDestination().getName();
  }
}
</script>
