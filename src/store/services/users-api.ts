import { usersSchemaDto } from "@/dto/users.dto"
import { positionsSchemaDto } from "@/dto/users-positions.dto"
import { UsersPositionsResponse, UsersResponse, UsersResponseParams } from "@/types/users"

import { appApi } from "./app-api"

export const visitApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersResponse, UsersResponseParams>({
      query: (params) => ({
        url: "/users",
        params
      }),
      transformResponse: (baseQueryReturnValue: UsersResponse) => {
        usersSchemaDto.parse(baseQueryReturnValue)
        return baseQueryReturnValue
      }
    }),

    getUsersPositions: builder.query<UsersPositionsResponse, void>({
      query: () => ({
        url: "/positions"
      }),
      transformResponse: (baseQueryReturnValue: UsersPositionsResponse) => {
        positionsSchemaDto.parse(baseQueryReturnValue)
        return baseQueryReturnValue
      }
    })
  })
})

export const { useGetAllUsersQuery, useLazyGetAllUsersQuery, useGetUsersPositionsQuery } =
  visitApi
