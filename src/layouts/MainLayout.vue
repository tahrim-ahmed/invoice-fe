<template>
	<q-layout view="hHh lpR fFf">
		<q-header elevated>
			<q-toolbar>
				<q-btn
						flat
						dense
						round
						icon="menu"
						aria-label="Menu"
						@click="leftDrawerOpen = !leftDrawerOpen"
				/>

				<q-toolbar-title>
					Distributor Invoice
				</q-toolbar-title>

				<div>
					<q-btn dense flat no-caps size="xs" stretch>
						<q-avatar>
							<q-icon name="fas fa-cogs" size="sm"/>
						</q-avatar>
						<q-menu>
							<div class="row no-wrap q-pa-md bg-blue-1">
								<div class="column items-center">
									<q-avatar size="72px">
										<q-img src="images/admin-icon.jpg"/>
									</q-avatar>

									<div class="q-mt-md q-mb-xs text-bold">
										{{$store.getters.currentUser? $store.getters.currentUser.userName :
											'null'}}
									</div>

								</div>

								<q-separator vertical inset class="q-mx-lg" />

								<div class="column">
									<div class="text-h6 q-mb-sm text-center">Settings</div>
									<q-item :to="{name:'profile'}" clickable dense tabindex="0" v-close-popup>
										<q-item-section side>
											<q-icon color="primary" name="manage_accounts" text-color="white"/>
										</q-item-section>
										<q-item-section>
											<q-item-label>Profile</q-item-label>
										</q-item-section>
									</q-item>
									<q-separator class="q-mt-xs"/>
									<q-item @click="logoutDialog = true" clickable dense tabindex="0" v-close-popup>
										<q-item-section side>
											<q-icon color="primary" name="fa fa-sign-out-alt" text-color="white"/>
										</q-item-section>
										<q-item-section>
											<q-item-label>Sign Out</q-item-label>
										</q-item-section>
									</q-item>
								</div>
							</div>
						</q-menu>
					</q-btn>
				</div>

			</q-toolbar>
		</q-header>

		<q-drawer
				v-model="leftDrawerOpen"
				show-if-above
				bordered
				content-class="bg-grey-1"
		>
			<q-list bordered class="rounded-borders">
				<q-item clickable v-ripple :to="{name: 'dashboard'}">
					<q-item-section avatar>
						<q-icon color="primary" name="dashboard" />
					</q-item-section>

					<q-item-section>Dashboard</q-item-section>
				</q-item>
				<q-separator/>
				<q-item clickable v-ripple :to="{name: 'clients'}">
					<q-item-section avatar>
						<q-icon color="primary" name="person" />
					</q-item-section>

					<q-item-section>Clients</q-item-section>
				</q-item>
				<q-separator/>
				<q-item clickable v-ripple :to="{name: 'products'}">
					<q-item-section avatar>
						<q-icon color="primary" name="category" />
					</q-item-section>

					<q-item-section>Products</q-item-section>
				</q-item>
				<q-separator/>
				<q-item clickable v-ripple :to="{name: 'purchase'}">
					<q-item-section avatar>
						<q-icon color="primary" name="shopping_bag" />
					</q-item-section>

					<q-item-section>Purchase</q-item-section>
				</q-item>
				<q-separator/>
				<q-item clickable v-ripple :to="{name: 'products'}">
					<q-item-section avatar>
						<q-icon color="primary" name="inventory" />
					</q-item-section>

					<q-item-section>Stock</q-item-section>
				</q-item>
				<q-separator/>
				<q-item clickable v-ripple :to="{name: 'report'}">
					<q-item-section avatar>
						<q-icon color="primary" name="receipt" />
					</q-item-section>
					<q-item-section>Invoice</q-item-section>
				</q-item>
				<q-separator/>
				<q-item clickable v-ripple :to="{name: 'statements'}">
					<q-item-section avatar>
						<q-icon color="primary" name="account_balance" />
					</q-item-section>
					<q-item-section>Account Statement</q-item-section>
				</q-item>
				<q-separator/>

				<q-expansion-item expand-separator :content-inset-level="0.5" class="text-primary" icon="engineering" label="Settings">

					<q-item clickable v-ripple :to="{name: 'groups'}">
						<q-item-section avatar>
							<q-icon color="primary" name="groups" />
						</q-item-section>
						<q-item-section>Groups</q-item-section>
					</q-item>
					<q-separator/>
					<q-item clickable v-ripple :to="{name: 'users'}">
						<q-item-section avatar>
							<q-icon color="primary" name="account_circle" />
						</q-item-section>
						<q-item-section>Users</q-item-section>
					</q-item>

				</q-expansion-item>
			</q-list>
		</q-drawer>

		<q-dialog v-model="logoutDialog" persistent>
			<q-card class="text-center text-overline bg-primary">
				<q-card-section class="text-weight-bold text-white">
					Sure to sign out?
				</q-card-section>
				<q-card-section class="q-pt-lg row q-col-gutter-xl">
					<div class="col-6">
						<q-btn v-close-popup color="positive" glossy @click="signOut">Yes</q-btn>
					</div>

					<div class="col-6">
						<q-btn v-close-popup color="negative" glossy>No</q-btn>
					</div>
				</q-card-section>
			</q-card>
		</q-dialog>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';
import {Loading, QSpinnerCube} from "quasar";

@Component({
})
export default class MainLayout extends Vue {
	leftDrawerOpen = false;

	logoutDialog = false

	async signOut() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerCube})

		if (this.$route.name !== 'login') {
			await this.$store.dispatch("logout");
			await this.$router.replace({name: 'login'}).catch((e: any) => e)
			this.$q.notify({
				message: 'Successfully Logged out!!',
				type: 'warning',
				timeout: 5000
			})
		}

		Loading.hide()
	}
}
</script>
