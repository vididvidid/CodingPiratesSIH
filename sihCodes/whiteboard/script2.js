

document.getElementById('component').addEventListener('click', function () {
    // Check if the sidebar already exists
    let sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        // Create the sidebar
        sidebar = document.createElement('div');
        sidebar.id = 'sidebar';
        sidebar.style.width = '250px'; // Reduced width
        sidebar.style.height = '70%'; // Reduced height
        sidebar.style.position = 'fixed';
        sidebar.style.top = '15%'; // Centered vertically
        sidebar.style.left = '0'; // Positioned on the left
        sidebar.style.background = 'linear-gradient(135deg, #ff9a9e, #fad0c4)'; // Colorful gradient background
        sidebar.style.borderRadius = '0 10px 10px 0'; // Rounded corners
        sidebar.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.3)';
        sidebar.style.padding = '20px';
        sidebar.style.zIndex = '1000';

        // Create the close button
        let closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginBottom = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.backgroundColor = '#ff6f61'; // Beautiful button color
        closeButton.style.color = '#fff';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', function () {
            document.body.removeChild(sidebar);
        });
        sidebar.appendChild(closeButton);

        // Create buttons for additional features
        const buttons = [
            { name: 'Graph viewer', color: '#6a89cc' },
            { name: 'File summary', color: '#82ccdd' },
            { name: 'File viewer', color: '#f8c291' },
            { name: 'File editor', color: '#78e08f' }
        ];

        buttons.forEach(btn => {
            let button = document.createElement('button');
            button.innerText = btn.name;
            button.style.marginBottom = '10px';
            button.style.padding = '10px 20px';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.backgroundColor = btn.color;
            button.style.color = '#fff';
            button.style.cursor = 'pointer';
            sidebar.appendChild(button);

            // Add event listener for the Graph viewer button
            if (btn.name === 'Graph viewer') {
                button.addEventListener('click', function () {
                    // Create a container for the graph
                    const graphContainer = document.createElement('div');
                    graphContainer.id = 'graph';
                    graphContainer.style.width = '100%';
                    graphContainer.style.height = '300px'; // Set height for the graph
                    graphContainer.style.backgroundColor = 'white';
                    graphContainer.style.borderRadius = '8px';
                    graphContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    document.body.appendChild(graphContainer);

                    // Your JSON data for the graph
                    const jsonData = {
                        "files": [
                            {
                                "name": "2024_Sem1_Grades.xlsx",
                                "type": "file",
                                "hierarchy": [
                                    "Educational Institution",
                                    "Department of Computer Science",
                                    "Academic Performance",
                                    "Student Grades"
                                ],
                                "path": "/files/computer_science/academic_performance/2024_Sem1_Grades.xlsx",
                                "creation_time": "2024-01-15T08:30:00Z",
                                "updated_time": "2024-08-25T10:45:00Z",
                                "size": "256KB",
                                "file_type": "xlsx",
                                "description": "Semester 1 grades for the Computer Science department."
                            },
                            {
                                "name": "AI_Research_Paper.pdf",
                                "type": "file",
                                "hierarchy": [
                                    "Educational Institution",
                                    "Department of Computer Science",
                                    "Research Publications",
                                    "Journals"
                                ],
                                "path": "/files/computer_science/research_publications/AI_Research_Paper.pdf",
                                "creation_time": "2023-12-01T09:15:00Z",
                                "updated_time": "2024-08-20T14:22:00Z",
                                "size": "1.2MB",
                                "file_type": "pdf",
                                "description": "Research paper on AI published in a journal."
                            }
                        ]
                    };

                    // Process JSON data to create nodes and links
                    function processData(jsonData) {
                        const nodes = new Set();
                        const links = [];

                        jsonData.files.forEach(file => {
                            file.hierarchy.forEach((node, index) => {
                                nodes.add(node);
                                if (index > 0) {
                                    links.push({ source: file.hierarchy[index - 1], target: node });
                                }
                            });
                            nodes.add(file.name);
                            links.push({ source: file.hierarchy[file.hierarchy.length - 1], target: file.name });
                        });

                        return {
                            nodes: Array.from(nodes).map(id => ({ id })),
                            links: links
                        };
                    }

                    const data = processData(jsonData);

                    const width = graphContainer.clientWidth; // Use the width of the graph container
                    const height = 300; // Fixed height

                    const svg = d3.select(graphContainer)
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);

                    const simulation = d3.forceSimulation(data.nodes)
                        .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
                        .force("charge", d3.forceManyBody().strength(-300))
                        .force("center", d3.forceCenter(width / 2, height / 2));

                    const link = svg.append("g")
                        .selectAll("line")
                        .data(data.links)
                        .join("line")
                        .attr("stroke", "#999")
                        .attr("stroke-opacity", 0.6)
                        .attr("stroke-width", 2);

                    const node = svg.append("g")
                        .selectAll("circle")
                        .data(data.nodes)
                        .join("circle")
                        .attr("r", 5)
                        .attr("fill", d => d.id.includes(".") ? "#f68e26" : "#69b3a2")
                        .call(drag(simulation));

                    const text = svg.append("g")
                        .selectAll("text")
                        .data(data.nodes)
                        .join("text")
                        .text(d => d.id)
                        .attr("font-size", 12)
                        .attr("dx", 8)
                        .attr("dy", 3);

                    simulation.on("tick", () => {
                        link
                            .attr("x1", d => d.source.x)
                            .attr("y1", d => d.source.y)
                            .attr("x2", d => d.target.x)
                            .attr("y2", d => d.target.y);

                        node
                            .attr("cx", d => d.x)
                            .attr("cy", d => d.y);

                        text
                            .attr("x", d => d.x)
                            .attr("y", d => d.y);
                    });

                    function drag(simulation) {
                        function dragstarted(event) {
                            if (!event.active) simulation.alphaTarget(0.3).restart();
                            event.subject.fx = event.subject.x;
                            event.subject.fy = event.subject.y;
                        }

                        function dragged(event) {
                            event.subject.fx = event.x;
                            event.subject.fy = event.y;
                        }

                        function dragended(event) {
                            if (!event.active) simulation.alphaTarget(0);
                            event.subject.fx = null;
                            event.subject.fy = null;
                        }

                        return d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended);
                    }
                });
            }
        });
  // Create the file upload input
  let fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.marginTop = '20px';
  fileInput.style.padding = '10px';
  fileInput.style.borderRadius = '5px';
  fileInput.style.border = '1px solid #ccc';
  fileInput.style.cursor = 'pointer';
  sidebar.appendChild(fileInput);

  // Append the sidebar to the body
  document.body.appendChild(sidebar);
}
        // Append the sidebar to the body
});
