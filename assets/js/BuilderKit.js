////// BuilderKit -> Service Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  const serviceLoadingMessage = document.getElementById("service-loading-message");
  if (serviceLoadingMessage) {serviceLoadingMessage.style.display = 'block';}

  try {
    const response = await fetch("./data/services.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const services = await response.json();
    renderServices(services);
  } catch (error) {
    console.error("Failed to load services:", error);
    if (serviceLoadingMessage) {
        serviceLoadingMessage.textContent = 'Error loading services.';
        serviceLoadingMessage.style.color = 'red';
    }
  }
  finally {
    if (serviceLoadingMessage) {
        serviceLoadingMessage.style.display = 'none';
    }
  }

});

function renderServices(services) {
  const container = document.getElementById("service-list");
  container.innerHTML = ""; // Clear previous

  services.forEach((service) => {
    const li = document.createElement("li");
    li.className = "service-item";

    li.innerHTML = `
      <div class="service-icon-box">
        <img src="${service.icon}" alt="${service.title}" width="40px" />
      </div>
      <div class="service-content-box">
        <h4 class="h4 service-item-title">${service.title}</h4>
        <p class="service-item-text">
          ${service.description}
        </p>
      </div>
    `;

    container.appendChild(li);
  });
}
//////////////////////////////////////////////////////


////// BuilderKit -> Testimonials Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  const testingMessage = document.getElementById("testimonial-loading-message");
  if (testingMessage) {testingMessage.style.display = 'block';}

  try{
        const response = await fetch("./data/testimonials.json");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

        const testimonials = await response.json();;
        if (!testimonials) return;

        const aboutPage = document.querySelector('article.about.active[data-page="about"]');
        if (!aboutPage) return;

        const list = aboutPage.querySelector(".testimonials-list");
        if (!list) return;

        renderTestimonials(testimonials, list);

        // Initialize scrolling and modal functionality
        initializeSlider(aboutPage, list);
        initializeModal(list);
      }
      catch (error) {
        console.error("Failed to load services:", error);
        if (testingMessage) {
            testingMessage.textContent = 'Error loading testimonials.';
            testingMessage.style.color = 'red';
        }
      }
      finally {
        if (testingMessage) {
            testingMessage.style.display = 'none';
        }
      }

});

function renderTestimonials(testimonials, container) {
  container.innerHTML = testimonials.map(testimonial => {
    return `
      <li class="testimonials-item">
        <div class="content-card" data-testimonial-id="${testimonial.id}">
          <figure class="testimonials-avatar-box">
            <img src="${testimonial.avatar}" alt="${testimonial.name}" width="60px" data-testimonials-avatar/>
          </figure>
          <h4 class="h4 testimonials-item-title" data-testimonials-title>${testimonial.name}</h4>
          <p hidden data-testimonials-fullname>${testimonial.fullName}</p>
          <p hidden data-testimonials-position>${testimonial.position}</p>
          <div class="testimonials-text" data-testimonials-text>
            <p>${testimonial.text}</p>
          </div>
        </div>
      </li>
    `;
  }).join('');
}

function initializeSlider(aboutPage, list) {
  const wrapper = aboutPage.querySelector(".testimonials-wrapper");
  const items = list.querySelectorAll(".testimonials-item");
  const itemsPerView = 2;
  const totalItems = items.length;
  let currentIndex = 0;

  if (totalItems <= itemsPerView) return;

  const slideTestimonials = () => {
    // Get the full width of a single item
    const singleItemWidth = items[0].offsetWidth;

    // Get the computed gap from the parent container
    const listStyle = window.getComputedStyle(list);
    const listGap = parseFloat(listStyle.gap);

    // The total width to scroll is the item's width plus half of the gap
    // because two items share one gap.
    const totalItemWidth = singleItemWidth + listGap;

    if (currentIndex >= totalItems - itemsPerView) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }

    const offset = currentIndex * totalItemWidth;
    list.style.transform = `translateX(-${offset}px)`;
  };

  setInterval(slideTestimonials, 3000);
}

function initializeModal(container) {
  const modal = document.querySelector(".modal-container");
  const overlay = document.querySelector(".overlay");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");

  if (!modal || !overlay || !modalCloseBtn) return;

  container.addEventListener("click", (event) => {
    const item = event.target.closest("[data-testimonial-id]");
    if (!item) return;
    
    // In a real app, you would fetch data by ID. For now, we'll
    // get it from the rendered HTML.
    const avatar = item.querySelector("[data-testimonials-avatar]");
    const fullname = item.querySelector("[data-testimonials-fullname]");
    const position = item.querySelector("[data-testimonials-position]");
    const text = item.querySelector("[data-testimonials-text]");
    
    // Populate modal with content
    const modalImg = modal.querySelector("[data-modal-img]");
    const modalTitle = modal.querySelector("[data-modal-title]");
    const modalPosition = modal.querySelector("[data-modal-position]");
    const modalText = modal.querySelector("[data-modal-text]");

    if (modalImg && avatar) {
      modalImg.src = avatar.src;
      modalImg.alt = avatar.modalTitle;
    }
    if (modalTitle && fullname) {
      modalTitle.textContent = fullname.textContent;
    }
    if (modalPosition && position) {
      modalPosition.textContent = position.textContent;
    }
    if (modalText && text) {
      modalText.innerHTML = text.innerHTML;
    }

    modal.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("no-scroll"); 
  });

  const closeModal = () => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll"); 
  };

  modalCloseBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
}
/////////////////////////////////////////////////////////////


////// BuilderKit -> Project Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
    const projectsLoadingMessage = document.getElementById("project-loading-message");
    if (projectsLoadingMessage) {projectsLoadingMessage.style.display = 'block';}

  try {
    const projectsResponse = await fetch("./data/projects.json");
    if (!projectsResponse.ok) {
      throw new Error(`HTTP error! Status: ${projectsResponse.status}`);
    }

    const projects = await projectsResponse.json();
    const sortedProjects = projects.sort((a, b) => b.id - a.id);

    renderProjects(sortedProjects);
    initFilters();
  } catch (error) {
    console.error("Failed to load projects:", error);
    if (projectsLoadingMessage) {
        projectsLoadingMessage.textContent = 'Error loading projects.';
        projectsLoadingMessage.style.color = 'red';
    }
  } finally {
    if (projectsLoadingMessage) {
        projectsLoadingMessage.style.display = 'none';
    }
  }

});

function renderProjects(projects) {
  const container = document.getElementById("projects-list");
  container.innerHTML = "";

  projects.forEach((project) => {
    const li = document.createElement("li");
    li.className = `project-item active`;
    li.setAttribute("data-filter-item", "");
    li.setAttribute("data-categories", project.categories.join(","));
    li.setAttribute("id", project.id);

    li.innerHTML = `
      <a href="#">
        <figure class="project-banner-box">
          <img src="${project.image}" alt="${project.title}" loading="lazy" project-image/>
        </figure>
        <div class="project-content">
          <h3 class="h3 project-title">${project.title}</h3>
          <p class="project-description">${project.objective}</p>
        </div>
      </a>
    `;

    container.appendChild(li);
  });

  //   // Call the new modal function here
  initializeProjectModal(projects, container);
}

function initFilters() {
  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const select = document.querySelector("[data-select]");

  // helper to get current project items (fresh NodeList each time)
  const getProjectItems = () => Array.from(document.querySelectorAll("[data-filter-item]"));

  // Normalize helper: trims and returns slug-like (ai-solutions)
  const normalize = (str) =>
    String(str || "").trim().toLowerCase().replace(/\s+/g, "-");

  const applyFilter = (category) => {
    const items = getProjectItems();

    items.forEach((item) => {
      const raw = item.getAttribute("data-categories") || "";
      const itemCategories = raw.split(",").map(s => s.trim()).filter(Boolean);
      const shouldShow = category === "all" || itemCategories.includes(category);

      item.style.display = shouldShow ? "" : "none";
      item.classList.toggle("active", shouldShow);
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.value ? btn.dataset.value.trim() : normalize(btn.textContent);
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (selectValue) selectValue.textContent = btn.textContent.trim();

      if (select) {
        select.classList.remove("open");
        select.setAttribute("aria-expanded", "false");
      }

      applyFilter(category);
    });
  });

  selectItems.forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.dataset.value ? item.dataset.value.trim() : normalize(item.textContent);

      if (selectValue) selectValue.textContent = item.textContent.trim();
      filterButtons.forEach((b) => {
        const bval = b.dataset.value ? b.dataset.value.trim() : normalize(b.textContent);
        b.classList.toggle("active", bval === category);
      });

      if (select) {
        select.classList.remove("open");
        select.setAttribute("aria-expanded", "false");
      }

      applyFilter(category);
    });
  });

  applyFilter("all");
}

function initializeProjectModal(projects, container) {
  const modal = document.querySelector('.project-modal-container');
  const overlay = document.querySelector('.project-overlay');
  const closeBtn = document.querySelector('[project-modal-close-btn]');

  if (!modal || !overlay || !closeBtn) {
    console.warn("Project modal elements not found. Modal functionality will not be initialized.");
    return;
  }

  container.addEventListener("click", (event) => {
    const item = event.target.closest("[id]");
    if (!item) return;

    const projectId = item.getAttribute("id");
    const project = projects.find(p => p.id === projectId);

    if (project) {
      const modalImg = modal.querySelector("[project-modal-imgage]");
      const modalTitle = modal.querySelector('[project-modal-title]');
      const modalTags = modal.querySelector('[project-modal-meta]');

      const modalObjective = modal.querySelector('[project-modal-objective]');
      const modalFeatures = modal.querySelector('[project-modal-features]');
      const modalResponsibility = modal.querySelector('[project-modal-responsibility]');
      const modalTechnology = modal.querySelector('[project-modal-technology]');
      const modalOutcome = modal.querySelector('[project-modal-outcome]');
      const modalLink = modal.querySelector('[project-modal-link]');

      // --- START: Formatting text ---
      const projTags = project.tags.map(tag => `<span>${tag}</span>`).join('<span class="dot"></span>');
      const proFeature = project.features.map(feature => `<span>- ${feature}</span>`).join('');
      // --- End: Formatting text ---

      modalImg.src = project.image;
      modalImg.alt = project.title;
      modalTitle.textContent = project.title;
      modalTags.innerHTML = projTags;
      modalObjective.innerHTML = project.objective;
      modalFeatures.innerHTML = proFeature;
      modalResponsibility.innerHTML= project.responsibility;
      modalTechnology.innerHTML= project.technology;
      modalOutcome.innerHTML= project.outcome;
      modalLink.innerHTML = `<a href="${project.link}" target="_blank" class="project-modal-link">View more details</a>`;
      
      modal.classList.add("active");
      overlay.classList.add("active");
      document.body.classList.add("no-scroll"); 
    }
  });

  const closeModal = () => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll"); 
  };

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
}
//////////////////////////////////////////////////////


////// BuilderKit -> Blog Post Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  const blogLoadingMessage = document.getElementById("blog-loading-message");
  if (blogLoadingMessage) {blogLoadingMessage.style.display = 'block';}

  try {
    const response = await fetch("./data/posts.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.error("Failed to load services:", error);
    if (blogLoadingMessage) {
        blogLoadingMessage.textContent = 'Error loading projects.';
        blogLoadingMessage.style.color = 'red';
    } 
  } finally {
    if (blogLoadingMessage) {
        blogLoadingMessage.style.display = 'none';
    }
  }
});

function renderPosts(posts) {
  const container = document.getElementById("blog-list");
  container.innerHTML = "";

  posts.forEach((post) => {
    const li = document.createElement("li");
    li.className = `blog-post-item`;
    li.setAttribute("data-blog-id", post.id);

    li.innerHTML = `
      <a href="${post.url || '#'}" target="_blank">
        <figure class="blog-banner-box">
          <img src="${post.image}" alt="${post.title}" loading="lazy"/>
        </figure>

        <div class="blog-content">
          <div class="blog-meta">
            <p class="blog-category">${post.category}</p>
            <span class="dot"></span>
            <time datetime="${post.date_published}">${post.date_published}</time>
          </div>
          <h3 class="h3 blog-item-title">${post.title}</h3>
          <p class="blog-text">${post.description || ''}</p> 
        </div>
      </a>
    `;

    container.appendChild(li);
  });
}
////////////////////////////////////////////////////////


////// BuilderKit -> Certifications Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  const courseLoadingMessage = document.getElementById("course-loading-message");
  if (courseLoadingMessage) {courseLoadingMessage.style.display = 'block';}

  try {
    const response = await fetch("./data/educations.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    renderTimelineItems(data.educations, "education-list");
    renderTimelineItems(data.certifications, "certifications-list");
    renderTimelineItems(data.workshops, "workshop-list");

  } catch (error) {
    console.error("Failed to load data:", error);
    if (courseLoadingMessage) {
        courseLoadingMessage.textContent = 'Error loading projects.';
        courseLoadingMessage.style.color = 'red';
    }
  } finally {
    if (courseLoadingMessage) {
        courseLoadingMessage.style.display = 'none';
    }
  }
});

function renderTimelineItems(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }
  
  container.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline-item";

    const credentialHtml = item.credentialUrl
      ? `
        <div class="timeline-credential">
          <span class="timeline-item-date">${item.date}</span>
          <a href="${item.credentialUrl}" target="_blank" class="timeline-credential-url">Show credential</a>
        </div>
        `
      : `<span class="timeline-item-date">${item.date}</span>`;

    li.innerHTML = `
      <h4 class="h4 timeline-item-title">${item.title}</h4>
      <span class="timeline-item-organization">${item.organization}</span>
      ${credentialHtml}
      <p class="timeline-text">${item.skill}</p>
    `;
    
    container.appendChild(li);
  });
}
/////////////////////////////////////////////////////////////


////// BuilderKit -> Experiences Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  const experienceLoadingMessage = document.getElementById("experience-loading-message");
  if (experienceLoadingMessage) {experienceLoadingMessage.style.display = 'block';}

  try {
    const response = await fetch("./data/experiences.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    renderExperiences(data);
  } catch (error) {
    console.error("Failed to load data:", error);
    if (experienceLoadingMessage) {
        experienceLoadingMessage.textContent = 'Error loading projects.';
        experienceLoadingMessage.style.color = 'red';
    }
  } finally {
    if (experienceLoadingMessage) {
        experienceLoadingMessage.style.display = 'none';
    }
  }
});

function renderExperiences(items) {
  const container = document.getElementById("experience-list");
  if (!container) {
    console.error(`Container with ID "${"experience-list"}" not found.`);
    return;
  }
  
  container.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline-item";

    const jobsHtml = `
      <ul>
        ${item.jobs.map(job => `<li class="timeline-text">${job}</li>`).join('')}
      </ul>
    `;

    li.innerHTML = `
      <h4 class="h4 timeline-item-title">${item.designation}</h4>
      <span class="timeline-item-organization">${item.organization}</span>
      <span class="timeline-item-date">${item.date}</span>
      ${jobsHtml}
    `;
    
    container.appendChild(li);
  });
}
/////////////////////////////////////////////////////////////