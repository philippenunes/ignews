import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import styles from '../post.module.scss';
import { createClient } from "@/src/prismicio";
import { useSession } from "next-auth/react";
import { ParsedUrlQuery } from 'querystring'

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps) {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`);
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                           Subscribe now 🤗
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

interface IParams extends ParsedUrlQuery {
    slug: string
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params as IParams;

    const prismic = createClient();

    const response = await prismic.getByUID('post', String(slug), {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    };

    return {
        props: {
            post
        },
        revalidate: 60 * 30,
    }

}