let countyURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;
let educationData;

let canvas = d3.select('#canvas');
let tooltip = d3.select('#tooltip')


let drawMap = () => {
  canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
      let id = countyDataItem['id']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })
      let percentage = county['bachelorsOrHigher']
      if (percentage <= 15) {
        return 'rgb(244, 12, 53)'
      } else if (percentage <= 30) {
        return 'rgb(241, 153, 96)'
      } else if (percentage <= 45) {
        return 'rgb(151, 242, 147)'
      } else {
        return 'rgb(22, 250, 86)';
      }
    })
    .attr('data-fips', (countyDataItem) => {
      return countyDataItem['id'];
    })
    .attr('data-education', (countyDataItem) => {
      let id = countyDataItem['id']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })
      let percentage = county['bachelorsOrHigher']
      return percentage;
    })
    .on('mouseover', (countyDataItem) => {
      tooltip.transition()
        .style('visibility', 'visible')

      let id = countyDataItem['id']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })

      tooltip.text(county['fips'] + ' - ' + county['area_name'] +
        ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
      tooltip.attr('data-education', county['bachelorsOrHigher'])
    })

    .on('mouseout', (countyDataItem) => {
      tooltip.transition()
        .style('visibility', 'hidden')
    })
};

d3.json(countyURL).then(
  (data, err) => {
    if (err) {
      console.log(err);
    } else {
      countyData = topojson.feature(data, data.objects.counties).features;
      console.log(countyData);

      d3.json(educationURL).then(
        (data, err) => {
          if (err) {
            console.log(err)
          } else {
            educationData = data
            console.log(educationData)
            drawMap()
          }
        }
      )
    }
  })

///this is a edit to the og file
//it failed, wah wah
