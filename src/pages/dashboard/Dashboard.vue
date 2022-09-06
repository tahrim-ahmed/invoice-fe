<template>
	<q-layout>
		<q-page-container>
			<q-page>
				<q-tabs v-model="statement"
				        class="text-primary text-bold q-pt-md"
				        indicator-color="transparent" left-icon="chevron_left" mobile-arrows
				        no-caps right-icon="chevron_right">

					<q-tab v-for="statement in statementData" :key="Math.random()" :name="statement.purpose.name">
						<q-card class="q-px-md" style="background: #00FFFF">
							<q-card-section>
								{{ statement.purpose.name }} <br>
								<span class="big-tag">
									{{ $helper.numDifferentiation(statement.amount) }}
								</span>
							</q-card-section>
						</q-card>
					</q-tab>

				</q-tabs>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";

@Component({})
export default class Index extends Vue {
	tab = 'info'

	statement = ''

	statementData: any[] = []

	created() {
		setTimeout(() => {
			this.getStatementData()
		}, 1100)
	}

	getStatementData() {
		this.$axios.get(`statement/statement-data`).then(response => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				this.statementData = res?.payload?.data || ''
				this.statement = this.statementData[0]?.purpose?.name
			}
			this.statementData[0].amount = this.statementData[0].amount - (this.statementData[3].amount + this.statementData[4].amount)
			this.statementData[1].amount = this.statementData[1].amount - this.statementData[2].amount
		})
	}
};
</script>
