import { RegistrationInput, Post } from "./interfaces";
import axios, { AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  data: T,
  success: boolean
  error: string | undefined 
}

export interface API {
  posts: {
    getPosts: () => Promise<AxiosResponse<ApiResponse<Post[]>>>
  }
  register: (input: RegistrationInput) => Promise<AxiosResponse<ApiResponse<unknown>>>
}

export const api: API = {
  posts: {
    getPosts: () => {
      return axios.get('http://localhost:3000/posts?sort=recent')
    },
  },
  register: (input: RegistrationInput) => {
    return axios.post('http://localhost:3000/users/new', {
      ...input
    })
  }
}