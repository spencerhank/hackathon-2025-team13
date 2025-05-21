import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useSolaceStore } from './solaceStore';

export const useMdmTrackerStore = defineStore('mdmTrackerStore', () => {
    const solaceStore = useSolaceStore();

    const mdmUpdates = ref([]);
    const mdmReceiverUp = ref(false);
    let mdmConsumer = null

    const priceMdmUpdates = computed(() => {
        return mdmUpdates.value.filter((mdmUpdate) => {
            return mdmUpdate.getDestination().getName().includes('acmeretail/mdm/price')
        })
    })

    const productMdmUpdates = computed(() => {
        return mdmUpdates.value.filter((mdmUpdate) => {
            return mdmUpdate.getDestination().getName().includes('acmeretail/mdm/product')
        })
    })

    async function receiveMdmUpdates() {
        return new Promise((resolve, reject) => {
            solaceStore.connect().then(() => {
                if (mdmReceiverUp.value) {
                    resolve()
                } else {
                    solaceStore.createConsumer(
                        "Retail360MdMTracker",
                        "acmeretail/mdm/>",
                        mdmHandlerCb
                    ).then((consumer) => {
                        mdmReceiverUp.value = !mdmReceiverUp.value
                        mdmConsumer = consumer
                        resolve()
                    })
                }
            })

        })
    }

    function disconnect() {
        mdmReceiverUp.value = !mdmReceiverUp.value
        mdmConsumer.dispose()
        solaceStore.disconnect()
    }

    function mdmHandlerCb(message) {
        // console.log('mdm update received')
        mdmUpdates.value.push(message)
    }

    return {
        receiveMdmUpdates,
        priceMdmUpdates,
        productMdmUpdates,
        disconnect,
        mdmUpdates
    }
})