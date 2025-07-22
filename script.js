const dataUrl =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const w = 800;
const h = 500;
const padding = 70;
const baseTemp = 8.66;

const temperatureColorPalette = [
  '#313695',
  '#4575b4',
  '#74add1',
  '#abd9e9',
  '#fee090',
  '#fdae61',
  '#f46d43',
  '#d73027',
];

d3.select('body')
  .append('h1')
  .attr('id', 'title')
  .text('Monthly Global Land-Surface Temperature');

d3.select('body')
  .append('h3')
  .attr('id', 'description')
  .text(`1753 - 2015: base temperature ${baseTemp} ℃`);

const svg = d3
  .select('body')
  .append('div')
  .attr('class', 'container')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0)
  .style('position', 'absolute')
  .style('pointer-events', 'none')
  .style('z-index', 10);

//=========================================================
const fetchTemperatureData = async () => {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const dataset = await response.json();
    const data = dataset.monthlyVariance;
    const years = data.map((d) => new Date(d['year'], 0));

    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    const extendedMinYear = new Date(minYear);
    extendedMinYear.setFullYear(extendedMinYear.getFullYear());

    const extendedMaxYear = new Date(maxYear);
    extendedMaxYear.setFullYear(extendedMaxYear.getFullYear());

    const xScale = d3
      .scaleTime()
      .domain([extendedMinYear, extendedMaxYear])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleBand()
      .domain(d3.range(1, 13)) // months 1–12
      .range([padding, h - padding]);

    const colorScale = d3
      .scaleQuantize()
      .domain(d3.extent(data, (d) => baseTemp + d.variance))
      .range(temperatureColorPalette);

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d) => xScale(new Date(d['year'], 0)))
      .attr('y', (d) => yScale(d.month))
      .attr('fill', (d) => colorScale(baseTemp + d.variance))
      .attr(
        'width',
        (w - 2 * padding) / (maxYear.getFullYear() - minYear.getFullYear())
      )
      .attr('height', yScale.bandwidth())
      .attr('data-year', (d) => d.year)
      .attr('data-month', (d) => d.month - 1)
      .attr('data-temp', (d) => (baseTemp + d.variance).toFixed(3))
      // ========================================================
      .on('mouseover', function (event, d) {
        tooltip
          .style('opacity', 1)
          .style('display', 'block')
          .attr('data-year', d.year)
          .html(
            `${d.year} - ${d3.timeFormat('%B')(new Date(0, d.month - 1))}<br>${(
              baseTemp + d.variance
            ).toFixed(1)}℃<br>${d.variance.toFixed(1)}℃`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 40 + 'px');

        d3.select(this).attr('stroke', 'black').transition().duration(200);
      })

      .on('mouseout', function () {
        tooltip.style('opacity', 0).style('display', 'none');
        d3.select(this).attr('stroke', null);
      });
    //===========================================================
    drawLegend(svg, w, colorScale);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((m) => d3.timeFormat('%B')(new Date(0, m - 1)));

    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0,${h - padding})`)
      .call(xAxis);

    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding},0)`)
      .call(yAxis);

    svg
      .append('text')
      .attr('x', w / 2)
      .attr('y', h - 35)
      .attr('id', 'x-text')
      .attr('text-anchor', 'middle')
      .text('Years [y]');
    svg
      .append('text')
      .attr('x', -h / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('id', 'y-text')
      .text('Months');
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const drawLegend = (svg, w, colorScale) => {
  const legendWidth = 300;
  const legendHeight = 30;
  const boxWidth = legendWidth / temperatureColorPalette.length;
  const legendX = (w - legendWidth) / 2;
  const legendY = 20;

  const legend = svg
    .append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${legendX}, ${legendY})`);

  legend
    .selectAll('rect')
    .data(temperatureColorPalette)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * boxWidth)
    .attr('width', boxWidth)
    .attr('height', legendHeight)
    .attr('fill', (d) => d)
    .attr('stroke', '#ccc');

  const tempExtent = colorScale.domain(); // [minTemp, maxTemp]

  const xScaleLegend = d3
    .scaleLinear()
    .domain(tempExtent)
    .range([0, legendWidth]);

  const xAxisLegend = d3
    .axisBottom(xScaleLegend)
    .ticks(temperatureColorPalette.length)
    .tickFormat(d3.format('.1f'));

  legend
    .append('g')
    .attr('id', 'x-axis-legend')
    .attr('transform', `translate(0, ${legendHeight})`)
    .call(xAxisLegend);
};

fetchTemperatureData();

// responsive design
