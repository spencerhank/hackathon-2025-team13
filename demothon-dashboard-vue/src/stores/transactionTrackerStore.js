import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useSolaceStore } from './solaceStore';


export const useTransactionTrackerStore = defineStore('transactionTrackerStore', () => {
    const solaceStore = useSolaceStore();


    const transactions = ref([]);
    const transactionReceiverUp = ref(false)
    const priceRegex = /"price":"([\d.]+)"/;
    const showTransactions = ref(false);


    const customerInitiatedTransactions = computed(() => {
        return transactions.value.filter((transaction) => {
            return transaction.getDestination().getName().includes('customerInitiated')
        })
    })

    const onlineInitiatedTransactions = computed(() => {
        return transactions.value.filter((transaction) => {
            return transaction.getDestination().getName().includes('onlineInitiated')
        })
    })

    const cancelledTransactions = computed(() => {
        return transactions.value.filter((transaction) => {
            return transaction.getDestination().getName().includes('Cancelled')
        })
    })

    const totalRevenue = computed(() => {
        let transactionRevenue = 0;
        // TODO: update to filter for only customerPaid or onlinePaid
        transactions.value.forEach((transaction) => {
            if (transaction.getDestination().getName().includes('Paid')) {
                let t = transaction.getBinaryAttachment()
                const match = t.match(priceRegex);
                if (match) {
                    transactionRevenue += Number(match[1])
                }
            }

            // console.log()
        })
        return Number(transactionRevenue.toFixed(2))
    })

    const latestPaidTransaction = computed(() => {
        let latestPaidTransaction = null
        for (let i = transactions.value.length - 1; i >= 0; i--) {
            if (transactions.value[i].getDestination().getName().includes('Paid')) {
                latestPaidTransaction = transactions.value[i]
                break;
            }
        }
        return latestPaidTransaction
    })

    const isTransactionReceiverUp = computed(() => {
        return transactionReceiverUp.value
    })

    async function receiveTransactions() {
        return new Promise((resolve, reject) => {

            solaceStore.connect().then(() => {
                if (transactionReceiverUp.value) {
                    resolve()
                } else {
                    solaceStore
                        .createConsumer(
                            "Retail360TransactionTracker",
                            "acmeRetail/storeOps/retailOrder/>",
                            transactionHandlerCb
                        )
                        .then(() => {
                            transactionReceiverUp.value = !transactionReceiverUp.value
                            resolve()
                        });
                }

            })
        })
    }

    function toggleShowTransactions() {
        showTransactions.value = !showTransactions.value
    }

    function disconnect() {
        transactionReceiverUp.value = !transactionReceiverUp.value
        solaceStore.disconnect();
    }

    function transactionHandlerCb(message) {
        transactions.value.push(message)
    }

    return {
        transactions,
        customerInitiatedTransactions,
        onlineInitiatedTransactions,
        cancelledTransactions,
        isTransactionReceiverUp,
        totalRevenue,
        latestPaidTransaction,
        showTransactions,
        toggleShowTransactions,
        disconnect,
        receiveTransactions


    }
}, {
    persist: {
        storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
    }
})