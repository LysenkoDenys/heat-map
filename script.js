const dataUrl =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const w = 800;
const h = 500;
const padding = 70;
const baseTemp = 8.66;

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

//=========================================================
// const tooltip = d3
//   .select('#tooltip')
//   .style('opacity', 0)
//   .style('position', 'absolute');

const fetchTemperatureData = async () => {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const dataset = await response.json();
    const data = dataset.monthlyVariance;
    const years = data.map((d) => new Date(d['year'], 0));

    // console.log(dataset.monthlyVariance[0]['year']); //
    // console.log(years); //

    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    const extendedMinYear = new Date(minYear);
    extendedMinYear.setFullYear(extendedMinYear.getFullYear() - 1);

    const extendedMaxYear = new Date(maxYear);
    extendedMaxYear.setFullYear(extendedMaxYear.getFullYear() + 1);

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
      .range([
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
      ]);

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
      .attr('data-temp', (d) => (baseTemp + d.variance).toFixed(3));
    // ========================================================
    // .on('mouseover', function (event, d) {
    //   tooltip
    //     .style('opacity', 1)
    //     .style('display', 'block')
    //     .attr('data-year', new Date(d.Year, 0))
    //     .html(
    //       `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}`
    //     )
    //     .style('left', parseInt(xScale(new Date(d['Year'], 0))) + 10 + 'px')
    //     .style(
    //       'top',
    //       parseInt(yScale(parseTime(d['Time']))) + padding / 2 + 'px'
    //     );

    //   d3.select(this)
    //     .attr('fill', 'red')
    //     .transition()
    //     .duration(200)
    //     .attr('r', 7);
    // })

    // .on('mouseout', function () {
    //   tooltip.style('opacity', 0);
    //   d3.select(this)
    //     .attr('fill', (d) => (d.Doping ? 'orange' : 'green'))
    //     .attr('r', 5);
    // });
    //===========================================================
    drawLegend(svg, w);

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

const drawLegend = (svg, w) => {
  const legend = svg.append('g').attr('id', 'legend');

  // legend
  //   .append('rect')
  //   .attr('x', w - 200)
  //   .attr('y', 100)
  //   .attr('width', 15)
  //   .attr('height', 15)
  //   .style('fill', 'orange');
  // legend
  //   .append('text')
  //   .attr('x', w - 180)
  //   .attr('y', 112)
  //   .text('Riders with doping allegations')
  //   .style('font-size', '12px')
  //   .attr('alignment-baseline', 'middle');

  // legend
  //   .append('rect')
  //   .attr('x', w - 200)
  //   .attr('y', 130)
  //   .attr('width', 15)
  //   .attr('height', 15)
  //   .style('fill', 'green');
  // legend
  //   .append('text')
  //   .attr('x', w - 180)
  //   .attr('y', 142)
  //   .text('No doping allegations')
  //   .style('font-size', '12px')
  //   .attr('alignment-baseline', 'middle');
};

fetchTemperatureData();

// "baseTemperature": 8.66,
// "monthlyVariance": [
//   {
//     "year": 1753,
//     "month": 1,
//     "variance": -1.366
//   },
//   {
//     "year": 1753,
//     "month": 2,
//     "variance": -2.223
//   },
//   {
//     "year": 1753,
//     "month": 3,
//     "variance": 0.211
//   },
