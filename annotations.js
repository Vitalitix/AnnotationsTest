Highcharts.AST.allowedTags.push('textarea')

export function addAnnotation(source, a) {
	//console.log(point)
	if (source.formatPrefix === 'point') {
		source.series.chart.addAnnotation({
			draggable: 'xy',
			events: {
				click() {
					editAnnotation(this.labels[0])
				},
			},
			labels: [
				{
					point: source.id,
					text: 'Annotation...',
				},
			],
		})
	} else {
		source.addAnnotation({
			draggable: 'xy',
			events: {
				click() {
					editAnnotation(this.labels[0])
				},
			},
			labels: [
				{
					points: [
						{
							id: a.id,
							x: a.x,
							y: a.y,
							xAxis: 0,
							yAxis: 0,
						},
					],
					text: a.text,
				},
			],
		})
	}
}

export function editAnnotation(label) {
	const chart = label.chart
	const zt = chart.options.chart.zoomType
	chart.series.forEach((s) => s.update({ enableMouseTracking: false }))
	chart.update({ chart: { zoomType: null } })
	function removeTT() {
		chart.editAnnBox.destroy()
		chart.editAnnBox = undefined
		chart.series.forEach((s) => s.update({ enableMouseTracking: true }))
		chart.update({ chart: { zoomType: zt } })
	}
	if (chart.editAnnBox) {
		removeTT()
	}
	const point = label.points[0]
	const inp_id = `inp-${point.id || point.options.id}`
	const text = `<div id="annotation">
			<textarea id="${inp_id}"></textarea>
			<button class="icon-ok"></button>
			<button class="icon-cancel"></button>
			<button class="icon-trash"></button>
		</div>`
	chart.editAnnBox = chart.renderer.label(text, chart.plotLeft + point.plotX, chart.plotTop + point.plotY, null, null, null, true).add(chart.rGroup)
	chart.rGroup.toFront().translate(-60, -80)
	const inp = document.getElementById(inp_id)
	const ok = document.querySelector('.icon-ok')
	const cancel = document.querySelector('.icon-cancel')
	const trash = document.querySelector('.icon-trash')
	inp.value = label.options.text.replaceAll('<br>', '\n')
	inp.focus()
	inp.rows = 4
	ok.addEventListener('click', (event) => {
		label.update({ text: inp.value.replaceAll('\n', '<br>') })
		removeTT()
	})
	cancel.addEventListener('click', (event) => {
		removeTT()
	})
	trash.addEventListener('click', (event) => {
		removeTT()
		chart.removeAnnotation(label.annotation)
	})
}

export function getAnnotations(chart) {
  return chart.annotations.map((a) => a.labels.map((l) => ({ x: l.points[0].x, y: l.points[0].y, id: l.points[0].options.id, text: l.options.text })))
}
