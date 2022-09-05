import axios, { AxiosInstance } from 'axios'

class AuthService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:5000/api',
      timeout: 1000,
    })
  }

  public async generateToken(email: string): Promise<any> {
    try {
      const { data } = await this.instance.post(`/generate_token`, {
        email,
      })
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new APIError(err.message)
      } else {
        throw new APIError('An unexpected error occurred')
      }
    }
  }
}

export const authService = new AuthService()

export class APIError extends Error {}
