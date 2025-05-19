import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useSolaceStore } from './solaceStore';

export const useMdmTrackerStore = defineStore('mdmTrackerStore', () => {
    const solaceStore = useSolaceStore();

    const mdmUpdates = ref([]);

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
        console.log('mdm update received')
        mdmUpdates.value.push(message)
    }

    return {
        receiveMdmUpdates,
        mdmUpdates
    }
})