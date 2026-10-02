import { API_BASE_URL } from '../../constants';

export class Api {
  public async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`Request failed:${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
