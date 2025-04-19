import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8000/api/ratings';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  addRating(rating: {
    project_id: number;
    engagement_rating: number;
    societal_value_rating: number;
    ecological_impact_rating: number;
    job_creation_rating: number;
  }): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(this.apiUrl, rating, { headers });
  }


  updateRating(ratingId: number, rating: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${ratingId}`, rating, { headers });
  }

  getRatingsByProject(projectId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/project/${projectId}`, { headers });
  }
}
