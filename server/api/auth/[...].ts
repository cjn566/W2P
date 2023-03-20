import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'
export default NuxtAuthHandler({
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        GithubProvider.default({
           clientId: '01cd43fc3e575d29efe0',
           clientSecret: '61391e67e2073336c3dea73c2528f1667315c34b'
        })
    ]
})