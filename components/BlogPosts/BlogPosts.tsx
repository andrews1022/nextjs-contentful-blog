import Link from 'next/link';

// components
import NextImage from '../NextImage/NextImage';

// styled components
import * as S from './BlogPosts.styles';

// utils
import { timeToRead } from '../../utils/timeToRead';

// custom types
import type { ContentfulBlogPost } from '../../types/contentful';

// props type
type BlogPostsProps = {
  posts: ContentfulBlogPost[];
};

const BlogPosts = ({ posts }: BlogPostsProps) => (
  <S.Wrapper>
    <S.MainHeading>Blog Posts</S.MainHeading>

    <S.Grid>
      {posts.map((post) => (
        <S.Card key={post.sys.id}>
          <NextImage imageData={post.image} />

          <S.CardBody>
            <S.PostTitle>{post.title}</S.PostTitle>

            <Link href={`/blog/${post.slug}`}>Read Post &rarr;</Link>

            <S.TimeToRead>{timeToRead(post.content)} min read</S.TimeToRead>
          </S.CardBody>
        </S.Card>
      ))}
    </S.Grid>
  </S.Wrapper>
);

export default BlogPosts;
