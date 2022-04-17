import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { ParsedUrlQuery } from 'querystring';

// styled components
import * as S from './blog.styles';

// custom types
import type { ContentfulBlogPost } from '../../types/contentful';

type ContentfulResponse = {
  data: {
    blogPostCollection: {
      items: ContentfulBlogPost[];
    };
  };
};

const gql = String.raw;

export const getStaticPaths: GetStaticPaths = async () => {
  // get contentful data
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        query: gql`
          query BlogPostSlugsQuery {
            blogPostCollection {
              items {
                slug
              }
            }
          }
        `
      })
    }
  );

  const { data }: ContentfulResponse = await response.json();

  const slugs = data.blogPostCollection.items.map((post) => ({ params: { slug: post.slug } }));

  return {
    paths: slugs,
    fallback: false // show 404 page
  };
};

// extend interface using type keyword
type IParams = ParsedUrlQuery & {
  slug: string;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // get contentful data
  const { slug } = params as IParams;

  // get contentful data
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        query: gql`
          query SingleBlogPostQuery($slug: String!) {
            blogPostCollection(where: { slug: $slug }, limit: 1) {
              items {
                author {
                  bio
                  image {
                    description
                    height
                    sys {
                      id
                    }
                    url
                    width
                  }
                  name
                }
                content
                image {
                  description
                  height
                  sys {
                    id
                  }
                  url
                  width
                }
                title
              }
            }
          }
        `,
        variables: {
          slug
        }
      })
    }
  );

  const { data }: ContentfulResponse = await response.json();

  const [blogPostData] = data.blogPostCollection.items;

  return {
    props: {
      blogPostData
    }
  };
};

// props type
type BlogPostPageProps = {
  blogPostData: ContentfulBlogPost;
};

const BlogPostPage: NextPage<BlogPostPageProps> = ({ blogPostData }) => (
  <div>
    {/* dyanmic head for seo */}
    <Head>
      <title>{blogPostData.title} | Andrew Shearer Dev Portfolio</title>
      <meta name='description' content={blogPostData.title} />
    </Head>

    <h1 className='title'>{blogPostData.title}</h1>

    <S.StyledReactMarkdown>{blogPostData.content}</S.StyledReactMarkdown>
  </div>
);

export default BlogPostPage;
