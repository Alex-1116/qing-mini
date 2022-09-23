import Vue from 'vue';
// import http from '@/api'

const app = {
	state: {
		oldMeAddedIds: []
	},
	mutations: {
		updateOldMeAddedIds(state, oldMeAddedIds) {
			state.oldMeAddedIds = oldMeAddedIds
		},
	},
	actions: {},
	getters: {}
}

export default app;
