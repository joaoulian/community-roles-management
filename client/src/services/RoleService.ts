import axios, { AxiosInstance } from 'axios'

class RoleService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:5000',
      timeout: 1000,
    })
  }

  public async createRole(role: CreateRole): Promise<any> {
    try {
      const { data } = await this.instance.post(`/role`, role)
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('error message: ', err.message)
        throw new APIError(err.message)
      } else {
        console.log('unexpected error: ', err)
        throw new APIError('An unexpected error occurred')
      }
    }
  }

  public async getRolesByCommunityId(communityId: string): Promise<any> {
    try {
      const { data } = await this.instance.get(
        `/role?communityId=${communityId}`
      )
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('error message: ', err.message)
        throw new APIError(err.message)
      } else {
        console.log('unexpected error: ', err)
        throw new APIError('An unexpected error occurred')
      }
    }
  }

  public async updateRole(roleId: string, params: UpdateRole): Promise<any> {
    try {
      const { data } = await this.instance.put(`/role/${roleId}`, params)
      return data
    } catch (err) {
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

interface CreateRole {
  allowList: string[]
  communityId: string
  name: string
  permissions: string[]
}

interface UpdateRole {
  name: string
  permissions: string[]
}

class APIError extends Error {}

export const roleService = new RoleService()
