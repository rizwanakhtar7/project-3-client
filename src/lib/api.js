import axios from 'axios'
import { getToken } from './auth'


const baseUrl = '/api'

function headers() {
  return {
    headers: { Authorization: `Bearer ${getToken()}` },
  }
}

// * Movie Requests

export function getAllMovies() {
  return axios.get(`${baseUrl}/movies`)
}

export function getSingleMovie(movieId) {
  return axios.get(`${baseUrl}/movies/${movieId}`)
}

export function createMovie(formdata) {
  return axios.post(`${baseUrl}/movies`, formdata, headers())
}

export function editMovie(id, formdata) {
  return axios.put(`${baseUrl}/movies/${id}`, formdata, headers())
}

export function deleteMovie(id) {
  return axios.delete(`${baseUrl}/movies/${id}`, headers())
}


// * Auth Requests

export function registerUser(formData) {
  return axios.post(`${baseUrl}/register`, formData)
}

export function loginUser(formData) {
  return axios.post(`${baseUrl}/login`, formData)
}