import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useSolaceStore } from './solaceStore';

export const useMdmTrackerStore = defineStore('mdmTrackerStore', () => {
    const solaceStore = useSolaceStore();

    const mdmUpdates = ref([]);

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
            solaceStore.createConsumer(
                "Retail360MdMTracker",
                "acmeretail/mdm/>",
                mdmHandlerCb
            ).then(() => {
                resolve()
            })
        })
    }

    function mdmHandlerCb(message) {
        // console.log('mdm update received')
        mdmUpdates.value.push(message)
    }

    return {
        receiveMdmUpdates,
        priceMdmUpdates,
        productMdmUpdates,
        mdmUpdates
    }
})