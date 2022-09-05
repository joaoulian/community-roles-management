import axios, { AxiosInstance } from 'axios'

export class UserService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:5000/api',
      timeout: 1000,
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
      },
    })
  }

  public async getUserData(): Promise<any> {
    try {
      const { data } = await this.instance.get(`/me`)
      return data
    } catch (err) {
      localStorage.removeItem('token')
      if (axios.isAxiosError(err)) {
        console.log('error message: ', err.message)
        throw new APIError(err.message)
      } else {
        console.log('unexpected error: ', err)
        throw new APIError('An unexpected error occurred')
      }
    }
  }
}

export class APIError extends Error {}
