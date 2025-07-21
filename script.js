const dataUrl =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const w = 800;
const h = 500;
const padding = 60;
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

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(new Date(d['year'], 0)))
      .attr('y', (d) => yScale(d.month))
      .attr('fill', 'green')
      .attr(
        'width',
        (w - 2 * padding) / (maxYear.getFullYear() - minYear.getFullYear())
      )
      .attr('height', yScale.bandwidth())
      .attr('data-year', (d) => d.year)
      .attr('data-month', (d) => d.month - 1);
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
    const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

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
