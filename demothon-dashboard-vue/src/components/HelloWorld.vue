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
              <!-- <v-row class="pl-5">
                <v-col cols="12">
                  <div class="text-h2 font-weight-bold"></div>
                </v-col>
              </v-row> -->
              <v-row class="pl-5 pr-5">
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
              <v-row>
                <v-col cols="6" class="pa-5">
                  <StoreDetailsChart
                    chartId="price-update-chart"
                    chartTitle="Price Update Metrics"
                    chartColor="#13B39C"
                    chartLabel="Price Updates"
                  />
                </v-col>
                <v-col cols="6" class="pa-5">
                  <StoreDetailsChart
                    chartId="product-update-chart"
                    chartTitle="Product Update Metrics"
                    chartColor="#066177"
                    chartLabel="Product Updates"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col cols="4"> <TransactionExplorer /><AISearch /> </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const links = ["Retail 360 Dashboard"];
import { onUnmounted } from "vue";
import { useTransactionTrackerStore } from "@/stores/transactionTrackerStore";
import { useMdmTrackerStore } from "@/stores/mdmTrackerStore";

const transactionTrackerStore = useTransactionTrackerStore();
transactionTrackerStore.receiveTransactions();

const mdmTrackerStore = useMdmTrackerStore();
mdmTrackerStore.receiveMdmUpdates();

onUnmounted(() => {
  console.log("Closing Transaction Receiver");
  transactionTrackerStore.disconnect();
});

function getMostRecentTransactionFromArray(transactionArray) {
  if (transactionArray && transactionArray.length > 0) {
    return transactionArray[transactionArray.length - 1];
  } else {
    return null;
  }
}
</script>
