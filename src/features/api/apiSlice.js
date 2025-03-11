import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({

    reducerPath: 'api',

    baseQuery: fetchBaseQuery({baseUrl: 'https://backend-app-pied.vercel.app/api/'}),

    tagTypes: ['Post'],

    endpoints: builder => ({
        addUsers: builder.mutation({
            query: initialPost => ({
                url: 'users/',
                method: 'POST',
                body: initialPost
            })
        }),
        getUsers: builder.query({
            query: () => '/users',
        }),
        uploadFile: builder.mutation({
            query: initialPost => ({
                url: 'uploadfiles/', 
                method: 'POST',
                body: initialPost
            })
        }),
        getUploadFiles: builder.query({
            query: () => '/uploadfiles'        
        }),
        uploadAudio: builder.mutation({
            query: initialPost => ({
                url: 'uploadaudios/',
                method: 'POST',
                body: initialPost
            })
        }),
        getUploadAudios: builder.query({
            query: () => '/uploadaudios'
        }),
        uploadVideo: builder.mutation({
            query: initialPost => ({
                url: 'uploadvideos/',
                method: 'POST',
                body: initialPost,
            })
        }),
        getUploadVideos: builder.query({
            query: () => '/uploadvideos'
        }),
        getNotes: builder.query({
            query: () => '/notes',
            providesTags: (result = [], error, arg) => [
                'Post',
                ...result.map(({ id }) => ({ type: 'Post', id }))
            ], 
        }),
        addNotes: builder.mutation({
            query: initialPost => ({
                url: 'notes/',
                method: 'POST',
                body: initialPost
            }),
            invalidatesTags: ['Post']
        }),
        editNote: builder.mutation({
            query: item => ({
                url: `/notes/${item.id}/`,
                method: 'PATCH',
                body: item
            }),
            invalidatesTags: ['Post']
        }),
        getFormTemplates: builder.query({
            query: () => '/formtemplates'
        }),
        uploadTextFile: builder.mutation({
            query: initialPost => ({
                url: 'uploadtextfiles/',
                method: 'POST',
                body: initialPost
            }),
        }),
        getTextFile: builder.query({
            query: () => '/uploadtextfiles'
        }),
        uploadPdfFile: builder.mutation({
            query: initialPost => ({
                url: 'uploadpdffiles/',
                method: 'POST',
                body: initialPost
            }), 
        }),
        getUploadPdf: builder.query({
            query: () => '/uploadpdffiles'
        }),
        getUploadedPdf: builder.query({
            query: () => '/uploadpdffiles'
        }),
        addCommunity: builder.mutation({
            query: initialPost => ({
                url: 'communities/',
                method: 'POST',
                body: initialPost
            }),
        }),
        getCommunities: builder.query({
            query: () => '/communities'
        }),
        verify_email: builder.mutation({
            query: item => ({
                url: `/users/${item.id}/`,
                method: 'PATCH',
                body: item
            })
        }),
        addMember: builder.mutation({
            query: item => ({
                url: 'members/',
                method: 'POST',
                body: item
            }),

        }),
        getMembers: builder.query({
            query: () => '/members'
        }),
        removeMember: builder.mutation({
            query: (id) => ({
                url: `/members/${id}`,
                method: 'DELETE'
            })
        }),
        acceptMembership: builder.mutation({
            query: item => ({
                url: `/members/${item.id}/`,
                method: 'PATCH',
                body: item
            })
        }),
        declineMembership: builder.mutation({
            query: item => ({
                url: `/members/${item.id}/`,
                method: 'PATCH',
                body: item
            })
        }),
        setAlarm: builder.mutation({
            query: item => ({
                url: 'alarms/',
                method: 'POST',
                body: item
            }),
        }),
        getAlarms: builder.query({
            query: () => '/alarms'
        }),
        removeAlarm: builder.mutation({
            query: (id) => ({
                url: `/alarms/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
        }),
        createFolder: builder.mutation({
            query: item => ({
                url: 'create_folders/',
                method: 'POST',
                body: item
            }),
        }),
        getfolders: builder.query({
            query: () => '/create_folders'
        }),
        uploadFiletoFolder: builder.mutation({
            query: item => ({
                url: 'upload_file_to_folders/',
                method: 'POST',
                body: item
            }),
        }),
        getUploadFiletoFolder: builder.query({
            query: () => '/upload_file_to_folders'
        }),
        deleteFile: builder.mutation({
            query: (id) => ({
                url: `/upload_file_to_folders/${id}`,
                method: 'DELETE'
            })
        }),
        deleteFolder: builder.mutation({
            query: (id) => ({
                url: `/create_folders/${id}`,
                method: 'DELETE'
            })
        }),
        submitMessage: builder.mutation({
            query: item => ({
                url: `support_messages/`,
                method: 'POST',
                body: item
            })
        }),

    })
    
})

export const {
    useAddUsersMutation, useGetUsersQuery, 
    useUploadFileMutation, useGetUploadFilesQuery,
    useGetUploadAudiosQuery, useUploadAudioMutation,
    useGetUploadVideosQuery, useUploadVideoMutation,
    useGetNotesQuery, useAddNotesMutation, useEditNoteMutation,
    useGetFormTemplatesQuery, 
    useUploadTextFileMutation, useGetTextFileQuery,
    useUploadPdfFileMutation, useGetUploadPdfQuery, useGetUploadedPdfQuery,
    useVerify_emailMutation,
    useAddCommunityMutation, useGetCommunitiesQuery,
    useAddMemberMutation, useGetMembersQuery,
    useRemoveMemberMutation,
    useAcceptMembershipMutation, useDeclineMembershipMutation,
    useSetAlarmMutation, useGetAlarmsQuery, useRemoveAlarmMutation,
    useCreateFolderMutation, useGetfoldersQuery,
    useUploadFiletoFolderMutation, useGetUploadFiletoFolderQuery,
    useDeleteFileMutation, useDeleteFolderMutation,
    useSubmitMessageMutation
} = apiSlice
