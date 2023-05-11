import localforage from 'localforage'

// Initialize LocalForage instance
const storage = localforage.createInstance({
    name: 'traygpt',
    description: 'Application state persistence'
});

export const piniaLocalForage = (({ store }) => {

    // Load the persisted state from LocalForage when the store is created
    storage.getItem(store.$id).then((storedState) => {
        if (storedState) {
            store.$patch(JSON.parse(storedState))
        }
    })

    // React to store changes and save them to LocalForage
    store.$subscribe((mutation, state) => {
        storage.setItem(store.$id, JSON.stringify(state))
    })
})