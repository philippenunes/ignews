import Head from "next/head";
import { GetStaticProps } from "next";
import { createClient } from "@/src/prismicio";
import { RichText } from 'prismic-dom';
import Link from "next/link";

import styles from './style.module.scss';

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface PostsProps {
    posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
                            <time>{post.updatedAt}</time>
                            <strong>{post.title}</strong>
                            <p>{post.excerpt}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
    const client = createClient();
    const response = await client.getAllByType('post');

    const posts = response.map(post => {
        const firstParagraph = post.data.content.find(content => content.type === 'paragraph') as any;
        const excerpt = firstParagraph.text.substring(0, 200) + '...'

        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt,
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        props: { posts }
    }
}