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
  container.innerHTML = ""; // clear before rendering

  projects.forEach((project) => {
    const li = document.createElement("li");
    li.className = "project-item active";
    li.setAttribute("data-filter-item", "");
    li.setAttribute("data-category", project.category.toLowerCase());

    li.innerHTML = `
      <a href="${project.url}">
        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img src="${project.image.src}" 
               alt="${project.image.alt}" 
               loading="${project.image.loading}" />
        </figure>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-category">${project.category}</p>
      </a>
    `;

    container.appendChild(li);
  });
}

// ---------------------------
// FILTER FUNCTIONALITY
// ---------------------------
function initFilters() {
  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const projectItems = document.querySelectorAll("[data-filter-item]");

  // Helper to filter items
  const applyFilter = (category) => {
    projectItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");

      if (category === "all" || category === itemCategory) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  };

  // Button filters
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.textContent.trim().toLowerCase();

      // remove active from all, add to clicked
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      applyFilter(category);
    });
  });

  // Dropdown filters
  selectItems.forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.textContent.trim().toLowerCase();
      selectValue.textContent = item.textContent;
      applyFilter(category);
    });
  });
}






// document.addEventListener("DOMContentLoaded", () => {
//   fetch("data/projects.json")
//     .then((res) => res.json())
//     .then((projects) => renderProjects(projects))
//     .catch((err) => console.error("Failed to load projects:", err));
// });

// function renderProjects(projects) {
//   const container = document.getElementById("projects-list");

//   projects.forEach((project) => {
//     const li = document.createElement("li");
//     li.className = "project-item active";
//     li.setAttribute("data-filter-item", "");
//     li.setAttribute("data-category", project.category.toLowerCase());

//     li.innerHTML = `
//       <a href="${project.url}">
//         <figure class="project-img">
//           <div class="project-item-icon-box">
//             <ion-icon name="eye-outline"></ion-icon>
//           </div>
//           <img src="${project.image.src}" 
//                alt="${project.image.alt}" 
//                loading="${project.image.loading}" />
//         </figure>
//         <h3 class="project-title">${project.title}</h3>
//         <p class="project-category">${project.category}</p>
//       </a>
//     `;

//     container.appendChild(li);
//   });
// }
