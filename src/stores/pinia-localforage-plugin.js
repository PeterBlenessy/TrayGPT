import localforage from 'localforage'

// Initialize LocalForage instance
const storage = localforage.createInstance({
    name: 'traygpt',
    storeName: 'settings',
    description: 'Application state persistence'
});

export const piniaLocalForage = (({ store }) => {

    //         // Load the persisted state from LocalForage when the store is created
    //         storage.getItem(store.$id).then((storedState) => {
    //             if (storedState) {
    //                 store.$patch(storedState)
    //             }
    //         })

    store.$subscribe((mutation, state) => {
        // React to store changes and save them to LocalForage
        console.log('subscribe', mutation, state)
        storage.setItem(store.$id, JSON.stringify(state))
    })
})