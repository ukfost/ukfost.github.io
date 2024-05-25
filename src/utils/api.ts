type Post = {
  slug: string;
  title: string;
  content: string;
  tags: Record<string, unknown>;
};

export async function getPosts(): Promise<Post[]> {
  const posts: Post[] = [];

  for (let offset = 0; offset < 100; offset += 20) {
    const resp = await fetch(
      `https://public-api.wordpress.com/rest/v1.1/sites/ukfost.wordpress.com/posts?offset=${offset}`
    );
    const data = await resp.json();
    if (data.posts.length) {
      posts.push(...data.posts);
    } else {
      break;
    }
  }

  return posts;
}
