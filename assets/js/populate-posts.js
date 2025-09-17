function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
}

function createBlogPostItem(post) {
  const li = document.createElement('li');
  li.className = 'blog-post-item';

  const a = document.createElement('a');
  a.className = 'blog-post-link';
  a.href = post.url || '#';
  a.setAttribute('data-blog-id', post.id || '');

  const figure = document.createElement('figure');
  figure.className = 'blog-banner-box';
  const img = document.createElement('img');
  img.src = post.image?.src || '';
  img.alt = post.image?.alt || '';
  if (post.image?.loading) img.loading = post.image.loading;
  figure.appendChild(img);

  const content = document.createElement('div');
  content.className = 'blog-content';

  const meta = document.createElement('div');
  meta.className = 'blog-meta';

  const category = document.createElement('p');
  category.className = 'blog-category';
  category.textContent = post.category || '';

  const dot1 = document.createElement('span');
  dot1.className = 'dot';

  const timeEl = document.createElement('time');
  timeEl.dateTime = post.date_published || '';
  timeEl.textContent = formatDate(post.date_published);

  const dot2 = document.createElement('span');
  dot2.className = 'dot';

  const readTime = document.createElement('span');
  readTime.className = 'read-time';
  readTime.textContent = post.read_time || '';

  meta.append(category, dot1, timeEl, dot2, readTime);

  const h3 = document.createElement('h3');
  h3.className = 'h3 blog-item-title';
  h3.textContent = post.title || '';

  const excerpt = document.createElement('p');
  excerpt.className = 'blog-text';
  excerpt.textContent = post.excerpt || '';

  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'blog-tags';
  (post.tags || []).forEach(tag => {
    const span = document.createElement('span');
    span.className = 'blog-tag';
    span.textContent = tag;
    tagsWrap.appendChild(span);
  });

  content.append(meta, h3, excerpt, tagsWrap);
  a.append(figure, content);
  li.appendChild(a);

  return li;
}

function renderPosts(posts) {
  const root = document.getElementById('blog-list');
  root.innerHTML = '';
  posts.forEach(post => root.appendChild(createBlogPostItem(post)));
}

// Fetch posts.json from the same folder
fetch('data/posts.json')
  .then(res => res.json())
  .then(data => renderPosts(data))
  .catch(err => console.error('Failed to load posts.json:', err));
