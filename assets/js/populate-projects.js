document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/projects.json")
    .then((res) => res.json())
    .then((projects) => {
      renderProjects(projects);
      initFilters();
    })
    .catch((err) => console.error("Failed to load projects:", err));
});

function renderProjects(projects) {
  const container = document.getElementById("projects-list");
  container.innerHTML = "";

  projects.forEach((project) => {
    const li = document.createElement("li");
    li.className = `project-item active`;
    li.setAttribute("data-filter-item", "");
    li.setAttribute("data-category", project.category.toLowerCase());

    li.innerHTML = `
      <a href="${project.link}">
        <figure class="project-banner-box">
          <img src="${project.image}" alt="${project.alt}" loading="lazy"/>
        </figure>
        <div class="project-content">
          <h3 class="h3 project-title">${project.title}</h3>
          <p class="project-category">${project.description}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join("")}
          </div>
        </div>
      </a>
    `;

    container.appendChild(li); // ✅ FIXED
  });
}

function initFilters() {
  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]"); // ✅ FIXED
  const projectItems = document.querySelectorAll("[data-filter-item]");

  const applyFilter = (category) => {
    projectItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category").toLowerCase();
      if (category === "all" || category === itemCategory) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.textContent.trim().toLowerCase();
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(category);
    });
  });

  selectItems.forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.textContent.trim().toLowerCase();
      selectValue.textContent = item.textContent;
      applyFilter(category);
    });
  });
}