import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { UpdateUser, User } from '../models/user';
import { MoviesService } from '../services/movies.service';
import { filterOption } from '../movie-table/movie-table.component';
import { forkJoin, take } from 'rxjs';
import { MessageService } from 'primeng/api';

interface StringFilterOption {
  id: string;
  name: String;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  user: User | undefined;
  loggedInUserId: string = '';
  roles: string[] = [];

  watchProvidersFilterOptions: filterOption[] = [];
  selectedWatchProviders: filterOption[] = [];

  languageOptions: StringFilterOption[] = [
    { name: 'English', id: 'en' },
    { name: 'French', id: 'fr' },
    { name: 'Spanish', id: 'es' },
    { name: 'Italian', id: 'it' },
    { name: 'German', id: 'de' },
    { name: 'Japanese', id: 'ja' },
    { name: 'Other', id: 'Other' },
  ];
  selectedLanguages: StringFilterOption[] = [];

  regionOptions: StringFilterOption[] = [
    { name: 'Andorra', id: 'AD' },
    { name: 'United Arab Emirates', id: 'AE' },
    { name: 'Afghanistan', id: 'AF' },
    { name: 'Antigua & Barbuda', id: 'AG' },
    { name: 'Anguilla', id: 'AI' },
    { name: 'Albania', id: 'AL' },
    { name: 'Armenia', id: 'AM' },
    { name: 'Netherlands Antilles', id: 'AN' },
    { name: 'Angola', id: 'AO' },
    { name: 'Antarctica', id: 'AQ' },
    { name: 'Argentina', id: 'AR' },
    { name: 'American Samoa', id: 'AS' },
    { name: 'Austria', id: 'AT' },
    { name: 'Australia', id: 'AU' },
    { name: 'Aruba', id: 'AW' },
    { name: 'Azerbaijan', id: 'AZ' },
    { name: 'Bosnia & Herzegovina', id: 'BA' },
    { name: 'Barbados', id: 'BB' },
    { name: 'Bangladesh', id: 'BD' },
    { name: 'Belgium', id: 'BE' },
    { name: 'Burkina Faso', id: 'BF' },
    { name: 'Bulgaria', id: 'BG' },
    { name: 'Bahrain', id: 'BH' },
    { name: 'Burundi', id: 'BI' },
    { name: 'Benin', id: 'BJ' },
    { name: 'Bermuda', id: 'BM' },
    { name: 'Brunei', id: 'BN' },
    { name: 'Bolivia', id: 'BO' },
    { name: 'Brazil', id: 'BR' },
    { name: 'Bahamas', id: 'BS' },
    { name: 'Bhutan', id: 'BT' },
    { name: 'Burma', id: 'BU' },
    { name: 'Bouvet Island', id: 'BV' },
    { name: 'Botswana', id: 'BW' },
    { name: 'Belarus', id: 'BY' },
    { name: 'Belize', id: 'BZ' },
    { name: 'Canada', id: 'CA' },
    { name: 'Cocos (Keeling) Islands', id: 'CC' },
    { name: 'Democratic Republic of the Congo (Kinshasa)', id: 'CD' },
    { name: 'Central African Republic', id: 'CF' },
    { name: 'Republic of the Congo (Brazzaville)', id: 'CG' },
    { name: 'Switzerland', id: 'CH' },
    { name: 'Côte d’Ivoire', id: 'CI' },
    { name: 'Cook Islands', id: 'CK' },
    { name: 'Chile', id: 'CL' },
    { name: 'Cameroon', id: 'CM' },
    { name: 'China', id: 'CN' },
    { name: 'Colombia', id: 'CO' },
    { name: 'Costa Rica', id: 'CR' },
    { name: 'Serbia and Montenegro', id: 'CS' },
    { name: 'Cuba', id: 'CU' },
    { name: 'Cape Verde', id: 'CV' },
    { name: 'Christmas Island', id: 'CX' },
    { name: 'Cyprus', id: 'CY' },
    { name: 'Czech Republic', id: 'CZ' },
    { name: 'Germany', id: 'DE' },
    { name: 'Djibouti', id: 'DJ' },
    { name: 'Denmark', id: 'DK' },
    { name: 'Dominica', id: 'DM' },
    { name: 'Dominican Republic', id: 'DO' },
    { name: 'Algeria', id: 'DZ' },
    { name: 'Ecuador', id: 'EC' },
    { name: 'Estonia', id: 'EE' },
    { name: 'Egypt', id: 'EG' },
    { name: 'Western Sahara', id: 'EH' },
    { name: 'Eritrea', id: 'ER' },
    { name: 'Spain', id: 'ES' },
    { name: 'Ethiopia', id: 'ET' },
    { name: 'Finland', id: 'FI' },
    { name: 'Fiji', id: 'FJ' },
    { name: 'Falkland Islands', id: 'FK' },
    { name: 'Micronesia', id: 'FM' },
    { name: 'Faroe Islands', id: 'FO' },
    { name: 'France', id: 'FR' },
    { name: 'Gabon', id: 'GA' },
    { name: 'United Kingdom', id: 'GB' },
    { name: 'Grenada', id: 'GD' },
    { name: 'Georgia', id: 'GE' },
    { name: 'French Guiana', id: 'GF' },
    { name: 'Ghana', id: 'GH' },
    { name: 'Gibraltar', id: 'GI' },
    { name: 'Greenland', id: 'GL' },
    { name: 'Gambia', id: 'GM' },
    { name: 'Guinea', id: 'GN' },
    { name: 'Guadeloupe', id: 'GP' },
    { name: 'Equatorial Guinea', id: 'GQ' },
    { name: 'Greece', id: 'GR' },
    { name: 'South Georgia & South Sandwich Islands', id: 'GS' },
    { name: 'Guatemala', id: 'GT' },
    { name: 'Guam', id: 'GU' },
    { name: 'Guinea-Bissau', id: 'GW' },
    { name: 'Guyana', id: 'GY' },
    { name: 'Hong Kong SAR China', id: 'HK' },
    { name: 'Heard & McDonald Islands', id: 'HM' },
    { name: 'Honduras', id: 'HN' },
    { name: 'Croatia', id: 'HR' },
    { name: 'Haiti', id: 'HT' },
    { name: 'Hungary', id: 'HU' },
    { name: 'Indonesia', id: 'ID' },
    { name: 'Ireland', id: 'IE' },
    { name: 'Israel', id: 'IL' },
    { name: 'India', id: 'IN' },
    { name: 'British Indian Ocean Territory', id: 'IO' },
    { name: 'Iraq', id: 'IQ' },
    { name: 'Iran', id: 'IR' },
    { name: 'Iceland', id: 'IS' },
    { name: 'Italy', id: 'IT' },
    { name: 'Jamaica', id: 'JM' },
    { name: 'Jordan', id: 'JO' },
    { name: 'Japan', id: 'JP' },
    { name: 'Kenya', id: 'KE' },
    { name: 'Kyrgyzstan', id: 'KG' },
    { name: 'Cambodia', id: 'KH' },
    { name: 'Kiribati', id: 'KI' },
    { name: 'Comoros', id: 'KM' },
    { name: 'St. Kitts & Nevis', id: 'KN' },
    { name: 'North Korea', id: 'KP' },
    { name: 'South Korea', id: 'KR' },
    { name: 'Kuwait', id: 'KW' },
    { name: 'Cayman Islands', id: 'KY' },
    { name: 'Kazakhstan', id: 'KZ' },
    { name: 'Laos', id: 'LA' },
    { name: 'Lebanon', id: 'LB' },
    { name: 'St. Lucia', id: 'LC' },
    { name: 'Liechtenstein', id: 'LI' },
    { name: 'Sri Lanka', id: 'LK' },
    { name: 'Liberia', id: 'LR' },
    { name: 'Lesotho', id: 'LS' },
    { name: 'Lithuania', id: 'LT' },
    { name: 'Luxembourg', id: 'LU' },
    { name: 'Latvia', id: 'LV' },
    { name: 'Libya', id: 'LY' },
    { name: 'Morocco', id: 'MA' },
    { name: 'Monaco', id: 'MC' },
    { name: 'Moldova', id: 'MD' },
    { name: 'Montenegro', id: 'ME' },
    { name: 'Madagascar', id: 'MG' },
    { name: 'Marshall Islands', id: 'MH' },
    { name: 'Macedonia', id: 'MK' },
    { name: 'Mali', id: 'ML' },
    { name: 'Myanmar (Burma)', id: 'MM' },
    { name: 'Mongolia', id: 'MN' },
    { name: 'Macau SAR China', id: 'MO' },
    { name: 'Northern Mariana Islands', id: 'MP' },
    { name: 'Martinique', id: 'MQ' },
    { name: 'Mauritania', id: 'MR' },
    { name: 'Montserrat', id: 'MS' },
    { name: 'Malta', id: 'MT' },
    { name: 'Mauritius', id: 'MU' },
    { name: 'Maldives', id: 'MV' },
    { name: 'Malawi', id: 'MW' },
    { name: 'Mexico', id: 'MX' },
    { name: 'Malaysia', id: 'MY' },
    { name: 'Mozambique', id: 'MZ' },
    { name: 'Namibia', id: 'NA' },
    { name: 'New Caledonia', id: 'NC' },
    { name: 'Niger', id: 'NE' },
    { name: 'Norfolk Island', id: 'NF' },
    { name: 'Nigeria', id: 'NG' },
    { name: 'Nicaragua', id: 'NI' },
    { name: 'Netherlands', id: 'NL' },
    { name: 'Norway', id: 'NO' },
    { name: 'Nepal', id: 'NP' },
    { name: 'Nauru', id: 'NR' },
    { name: 'Niue', id: 'NU' },
    { name: 'New Zealand', id: 'NZ' },
    { name: 'Oman', id: 'OM' },
    { name: 'Panama', id: 'PA' },
    { name: 'Peru', id: 'PE' },
    { name: 'French Polynesia', id: 'PF' },
    { name: 'Papua New Guinea', id: 'PG' },
    { name: 'Philippines', id: 'PH' },
    { name: 'Pakistan', id: 'PK' },
    { name: 'Poland', id: 'PL' },
    { name: 'St. Pierre & Miquelon', id: 'PM' },
    { name: 'Pitcairn Islands', id: 'PN' },
    { name: 'Puerto Rico', id: 'PR' },
    { name: 'Palestinian Territories', id: 'PS' },
    { name: 'Portugal', id: 'PT' },
    { name: 'Palau', id: 'PW' },
    { name: 'Paraguay', id: 'PY' },
    { name: 'Qatar', id: 'QA' },
    { name: 'Réunion', id: 'RE' },
    { name: 'Romania', id: 'RO' },
    { name: 'Serbia', id: 'RS' },
    { name: 'Russia', id: 'RU' },
    { name: 'Rwanda', id: 'RW' },
    { name: 'Saudi Arabia', id: 'SA' },
    { name: 'Solomon Islands', id: 'SB' },
    { name: 'Seychelles', id: 'SC' },
    { name: 'Sudan', id: 'SD' },
    { name: 'Sweden', id: 'SE' },
    { name: 'Singapore', id: 'SG' },
    { name: 'St. Helena', id: 'SH' },
    { name: 'Slovenia', id: 'SI' },
    { name: 'Svalbard & Jan Mayen', id: 'SJ' },
    { name: 'Slovakia', id: 'SK' },
    { name: 'Sierra Leone', id: 'SL' },
    { name: 'San Marino', id: 'SM' },
    { name: 'Senegal', id: 'SN' },
    { name: 'Somalia', id: 'SO' },
    { name: 'Suriname', id: 'SR' },
    { name: 'South Sudan', id: 'SS' },
    { name: 'São Tomé & Príncipe', id: 'ST' },
    { name: 'Soviet Union', id: 'SU' },
    { name: 'El Salvador', id: 'SV' },
    { name: 'Syria', id: 'SY' },
    { name: 'Eswatini (Swaziland)', id: 'SZ' },
    { name: 'Turks & Caicos Islands', id: 'TC' },
    { name: 'Chad', id: 'TD' },
    { name: 'French Southern Territories', id: 'TF' },
    { name: 'Togo', id: 'TG' },
    { name: 'Thailand', id: 'TH' },
    { name: 'Tajikistan', id: 'TJ' },
    { name: 'Tokelau', id: 'TK' },
    { name: 'Timor-Leste', id: 'TL' },
    { name: 'Turkmenistan', id: 'TM' },
    { name: 'Tunisia', id: 'TN' },
    { name: 'Tonga', id: 'TO' },
    { name: 'East Timor', id: 'TP' },
    { name: 'Turkey', id: 'TR' },
    { name: 'Trinidad & Tobago', id: 'TT' },
    { name: 'Tuvalu', id: 'TV' },
    { name: 'Taiwan', id: 'TW' },
    { name: 'Tanzania', id: 'TZ' },
    { name: 'Ukraine', id: 'UA' },
    { name: 'Uganda', id: 'UG' },
    { name: 'U.S. Outlying Islands', id: 'UM' },
    { name: 'United States', id: 'US' },
    { name: 'Uruguay', id: 'UY' },
    { name: 'Uzbekistan', id: 'UZ' },
    { name: 'Vatican City', id: 'VA' },
    { name: 'St. Vincent & Grenadines', id: 'VC' },
    { name: 'Venezuela', id: 'VE' },
    { name: 'British Virgin Islands', id: 'VG' },
    { name: 'U.S. Virgin Islands', id: 'VI' },
    { name: 'Vietnam', id: 'VN' },
    { name: 'Vanuatu', id: 'VU' },
    { name: 'Wallis & Futuna', id: 'WF' },
    { name: 'Samoa', id: 'WS' },
    { name: 'Czechoslovakia', id: 'XC' },
    { name: 'East Germany', id: 'XG' },
    { name: 'Northern Ireland', id: 'XI' },
    { name: 'Kosovo', id: 'XK' },
    { name: 'Yemen', id: 'YE' },
    { name: 'Mayotte', id: 'YT' },
    { name: 'Yugoslavia', id: 'YU' },
    { name: 'South Africa', id: 'ZA' },
    { name: 'Zambia', id: 'ZM' },
    { name: 'Zaire', id: 'ZR' },
    { name: 'Zimbabwe', id: 'ZW' },
  ];
  selectedRegion?: StringFilterOption;

  constructor(
    private userService: UserService,
    private moviesService: MoviesService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    forkJoin({
      user: this.authService.user$.pipe(take(1)), // Observable for the current user
      watchProviders: this.moviesService.getWatchProviders(), // Observable for watch providers
    }).subscribe(({ user, watchProviders }) => {
      console.log('User and Watch Providers:');
      console.log(user);
      console.log(watchProviders);
      if (user) {
        this.loggedInUserId = user['_id'];
        this.roles = user['myroles'];

        this.selectedLanguages = (user['language'] || []).map(
          (lang: string) => {
            return this.languageOptions.find((option) => option.id === lang);
          }
        ) as StringFilterOption[];

        let region = user['region'] || undefined;
        this.selectedRegion = this.regionOptions.find(
          (option) => option.id === region
        );

        console.log(this.selectedLanguages);
        console.log(user['language']);

        this.userService.getUser(this.loggedInUserId).subscribe((response) => {
          this.user = response;
        });

        this.watchProvidersFilterOptions = watchProviders;
        this.userService
          .getUserWatchProviders(Number(this.loggedInUserId))
          .subscribe((response) => {
            // Map the response (array of IDs) to filterOption objects from watchProvidersFilterOptions
            this.selectedWatchProviders = response.watchProviders
              .map((id: number) =>
                this.watchProvidersFilterOptions.find(
                  (option) => option.id === id
                )
              )
              .filter((option): option is filterOption => !!option); // Filter out any undefined values
          });
      }
    });
  }

  saveSettings(): void {
    if (this.user) {
      let updatedUser: UpdateUser = {
        language: this.selectedLanguages.map((lang) => lang.id),
        region: this.selectedRegion?.id,
        watch_providers: this.selectedWatchProviders.map(
          (provider) => provider.id
        ),
      };
      this.userService.updateUser(this.user.id, updatedUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Settings Updated',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save settings',
          });
        },
      });
    }
  }

  getAvatar(avatarUrl: string): string {
    return avatarUrl.replace('.jpg', '_full.jpg');
  }
}
