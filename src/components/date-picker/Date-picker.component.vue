<template>
	<q-field v-model="text" :clearable="clearable" :dense="dense" :filled="filled" :hide-bottom-space="hideBottomSpace"
	         :label="label" outlined
	         :readonly="readonly" :rules="rules" :stack-label="stackLabel" @clear="onChangeDate('')">
		<q-menu v-model="showCalendar" anchor="bottom left" self="top left">
			<q-date v-model="date" :options="options" :readonly="readonly" minimal/>
		</q-menu>
		<template v-slot:control>
			<div class="self-center full-width no-outline" tabindex="0">{{ formattedDate }}</div>
		</template>
	</q-field>
</template>

<script lang='ts'>
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import moment from "moment";

@Component
export default class DatePickerComponent extends Vue {
	@Prop()
	value: any

	@Prop({default: false, type: Boolean})
	hideBottomSpace: boolean

	@Prop({default: true})
	dense: boolean

	@Prop()
	rules: any[]

	@Prop()
	stackLabel: boolean

	@Prop()
	readonly: boolean

	@Prop()
	filled: boolean

	@Prop()
	label: string

	@Prop()
	clearable: boolean

	@Prop()
	options: Function

	showCalendar = false
	formattedDate: string = 'Select Date'
	text = ''
	date: string = ''

	created() {
		if (!!this.label) {
			this.formattedDate = ''
		}
		if (this.value) {
			this.date = moment(this.value).format('YYYY-MM-DD')
		}
	}

	@Watch('date', {
		immediate: true
	})
	onChangeDate(value: string) {
		let returnValue: string = ''
		if (value.length) {
			this.formattedDate = moment(value).format('DD MMM, YYYY')
			this.text = this.formattedDate
			returnValue = moment(value).format('YYYY-MM-DD')
		} else {
			if (!!this.label) {
				this.formattedDate = ''
			} else {
				this.formattedDate = 'Select Date'
			}
			this.text = ''
		}
		this.showCalendar = false
		this.$emit('input', returnValue)
	}
}
</script>

<style lang='scss'>
</style>
