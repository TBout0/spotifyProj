import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import SpotifyArtist from 'src/assets/Artists';
import SpotifyTrack from 'src/assets/Tracks';
@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css'],
})
export class SpotifyComponent {
  private auth_Code: string = '';
  public access_Token: string = '';
  public clientId: string = '';
  public clientSecret: string = '';
  private redirectUri: string = 'http://localhost:4200/spotify';
  private error: string = '';
  public term: string = 'medium';
  public artists: SpotifyArtist[] = [];
  public tracks: SpotifyTrack[] = [];
  public formCompleted: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  saveClient() {
    localStorage.setItem('clientId', this.clientId);
    localStorage.setItem('clientSecret', this.clientSecret);
  }
  deleteClient() {
    localStorage.removeItem('clientId');
    this.clientId = '';
    localStorage.removeItem('clientSecret');
    this.clientSecret = '';
  }
  getClient() {
    let clientId = localStorage.getItem('clientId');
    let clientSecret = localStorage.getItem('clientSecret');
    if (clientId && clientSecret) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
    } else {
      this.deleteClient();
    }
  }
  redirect() {
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user-top-read`;
  }
  getToken() {
    this.http
      .post(
        'https://accounts.spotify.com/api/token',
        `grant_type=authorization_code&code=${this.auth_Code}&redirect_uri=${this.redirectUri}&client_id=${this.clientId}&client_secret=${this.clientSecret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .subscribe({
        next: (data: any) => {
          this.access_Token = data.access_token;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  getData() {
    this.http
      .get(
        `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${this.term}_term`,
        {
          headers: new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.access_Token}`
          ),
        }
      )
      .subscribe({
        next: (data: any) => {
          this.artists = data.items;
          this.artists.sort((a, b) => b.popularity - a.popularity);
          console.log(this.artists);
        },
        error: (err: any) => {
          console.log(JSON.stringify(err));
        },
      });
    this.http
      .get(
        `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${this.term}_term`,
        {
          headers: new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.access_Token}`
          ),
        }
      )
      .subscribe({
        next: (data: any) => {
          this.tracks = data.items;
          this.tracks.sort((a, b) => b.popularity - a.popularity);
        },
        error: (err: any) => {
          console.log(JSON.stringify(err));
        },
      });
  }
  ngOnInit() {
    this.getClient();
    this.route.queryParamMap.subscribe((params) => {
      let code = params.get('code');
      if (code) {
        this.auth_Code = code;
        this.formCompleted = true;
      }
      let error = params.get('error');
      if (error) {
        this.error = error;
      }
      if (this.auth_Code != '') {
        this.getToken();
      }
      this.router.navigate(['/spotify']);
    });
  }
}
