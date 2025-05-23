<template>
  <v-app id="inspire">
    <!-- <v-app-bar flat>
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-avatar class="me-4" size="32">
          <v-icon>mdi-store-analytics</v-icon>
        </v-avatar>

        <v-btn
          v-for="link in links"
          :key="link"
          :text="link"
          variant="text"
        ></v-btn>

        <v-spacer></v-spacer>
      </v-container>
    </v-app-bar> -->

    <v-main class="bg-grey-lighten-3">
      <v-container class="">
        <v-row>
          <v-col cols="8">
            <v-sheet min-height="70vh" rounded="lg">
              <v-row class="" v-show="showDiagram">
                <v-col col="12">
                  <v-img src="../assets/architecture-overview.png"></v-img>
                </v-col>
              </v-row>
              <v-row class="pl-5 pr-5" v-show="!showDiagram">
                <v-col cols="6">
                  <TransactionTracker
                    cardTitle="Total Revenue"
                    textColor="text-green"
                    :trackedTransactions="transactionTrackerStore.totalRevenue"
                    :mostRecentTransaction="
                      transactionTrackerStore.latestPaidTransaction
                    "
                    :showTransactionState="
                      transactionTrackerStore.showTransactions
                    "
                    isCurrency="true"
                    cardSuffix=""
                  />
                </v-col>
                <v-col cols="6">
                  <TransactionTracker
                    cardTitle="In Store Orders"
                    textColor="text-green"
                    :trackedTransactions="
                      transactionTrackerStore.customerInitiatedTransactions
                        .length
                    "
                    :mostRecentTransaction="
                      getMostRecentTransactionFromArray(
                        transactionTrackerStore.customerInitiatedTransactions
                      )
                    "
                    :showTransactionState="
                      transactionTrackerStore.showTransactions
                    "
                    cardSuffix=" new orders"
                  />
                </v-col>
                <v-col cols="6">
                  <TransactionTracker
                    cardTitle="Online Orders"
                    textColor="text-green"
                    :trackedTransactions="
                      transactionTrackerStore.onlineInitiatedTransactions.length
                    "
                    :mostRecentTransaction="
                      getMostRecentTransactionFromArray(
                        transactionTrackerStore.onlineInitiatedTransactions
                      )
                    "
                    :showTransactionState="
                      transactionTrackerStore.showTransactions
                    "
                    cardSuffix=" new online orders"
                  />
                </v-col>
                <v-col cols="6">
                  <TransactionTracker
                    cardTitle="Cancelled Orders"
                    textColor="text-red"
                    :trackedTransactions="
                      transactionTrackerStore.cancelledTransactions.length
                    "
                    :mostRecentTransaction="
                      getMostRecentTransactionFromArray(
                        transactionTrackerStore.cancelledTransactions
                      )
                    "
                    :showTransactionState="
                      transactionTrackerStore.showTransactions
                    "
                  />
                </v-col>
              </v-row>
              <v-row v-show="!showDiagram">
                <v-col cols="6" class="pa-5">
                  <StoreDetailsChart
                    chartId="price-update-chart"
                    chartTitle="Price Update Metrics"
                    chartColor="#13B39C"
                    chartLabel="Price Updates"
                    :chartData="mdmTrackerStore.priceMdmUpdates"
                  />
                </v-col>
                <v-col cols="6" class="pa-5">
                  <StoreDetailsChart
                    chartId="product-update-chart"
                    chartTitle="Product Update Metrics"
                    chartColor="#066177"
                    chartLabel="Product Updates"
                    :chartData="mdmTrackerStore.productMdmUpdates"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col cols="4">
            <v-sheet>
              <v-col cols="9" class="pl-5">
                <v-btn
                  :color="diagramBtnColor"
                  @click="showDiagram = !showDiagram"
                >
                  {{ diagramBtnText }}
                </v-btn></v-col
              >
            </v-sheet>

            <TransactionExplorer /><AISearch />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const links = ["Retail 360 Dashboard"];
import { ref, onBeforeUnmount } from "vue";
import { useTransactionTrackerStore } from "@/stores/transactionTrackerStore";
import { useMdmTrackerStore } from "@/stores/mdmTrackerStore";
import { useSolaceStore } from "@/stores/solaceStore";

const solaceStore = useSolaceStore();
const transactionTrackerStore = useTransactionTrackerStore();
const mdmTrackerStore = useMdmTrackerStore();

const showDiagram = ref(true);

const diagramBtnColor = computed(() => {
  if (showDiagram.value) {
    return "red";
  } else {
    return "green";
  }
});

const diagramBtnText = computed(() => {
  if (showDiagram.value) {
    return "Hide Diagram";
  } else {
    return "Show Diagram";
  }
});

solaceStore.connect().then(() => {
  transactionTrackerStore.receiveTransactions();
  mdmTrackerStore.receiveMdmUpdates();
});

onBeforeUnmount(() => {
  console.log("Closing Transaction Receiver");
  // transactionTrackerStore.disconnect();
  mdmTrackerStore.disconnect();
});

function getMostRecentTransactionFromArray(transactionArray) {
  if (transactionArray && transactionArray.length > 0) {
    return transactionArray[transactionArray.length - 1];
  } else {
    return null;
  }
}
</script>
