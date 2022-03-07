

async function run() {
    const url = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
    const data = await url.json()

    const width = 960;
    const height = 600;



    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const svg = d3.select("#container").append("svg")
        .attr("width", width)
        .attr("height", height)

    const treemap = d3.treemap()
        .size([width, height])
        .padding(0.5)

    const root = d3.hierarchy(data)
        .sum(d => d.value)




    treemap(root)



    const cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${d.x0}, ${d.y0})`)

    const tile = cell.append("rect")
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => color(d.data.category))
        .on("mouseover", (d, i) => {
            const {
                name,
                category,
                value
            } = d.data
            tooltip.classList.add("show")
            tooltip.style.left = (d3.event.pageX) + "px"
            tooltip.style.top = (d3.event.pageY - 100) + "px"
            tooltip.setAttribute("data-value", value)
            tooltip.innerHTML = `
            <p>${name}</p>
            <p>${category}</p>
            <p>${value}</p>
            `
        })
        .on("mouseout", () => {
            tooltip.classList.remove("show")
        })

    cell.append("text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter().append("tspan")
        .attr("style", "font-size:12px")
        .attr("x", 4)
        .attr("y", (d, i) => 15 + i * 15)
        .text(d => d)
    const categories = root.leaves().map(n => n.data.category)
        .filter((item, idx, arr) => arr.indexOf(item) === idx)
    console.log(categories)
   

    const block = 20
    const legendW = 150
    const legendH = (block + 2) * categories.length


    const legend = d3.select("body")
        .append("svg")
        .attr("id", "legend")
        .attr("width", legendW)
        .attr("height", legendH)

    legend.selectAll("rect")
        .data(categories)
        .enter()
        .append("rect")
        .attr("class", "legend-item")
        .attr("fill", d => color(d))
        .attr("x", block / 2)
        .attr("y", (_, i) => i * (block + 1) + 10)
        .attr("width", block)
        .attr("height", block)

    legend.append("g")
        .selectAll("text")
        .data(categories)
        .enter()
        .append("text")
        .attr("fill", "black")
        .attr("x", block * 2)
        .attr("y", (_, i) => i * (block + 1) + 25)
        .text(d => d)


}
run()