import {Component, OnInit, ViewChild} from "@angular/core";
import {AnnounceService} from "../../services/announce-service";
import {CrowdfundingService} from "../../services/crowdfunding-service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'home',
  template: require('../../app/topbar.html') + require('./home.html')
})
export class HomePage implements OnInit {

  @ViewChild('searchbar') searchbar;

  limits:any = [10, 20, 50, 100]
  limit:Number = 10
  page:any = 1
  pages:any = 1
  titre:string = "Toutes les annonces"
  search:string = undefined
  loading:Boolean = false
  hasSearch:Boolean = true
  searchEnabled:Boolean = false
  announces:Array<any>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private announceService:AnnounceService,
    private crowdfundingService:CrowdfundingService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = parseInt(params['page']) || 1
      this.limit = parseInt(params['limit']) || 10
      this.search = params['search']
      this.searchEnabled = params['search'] !== undefined
      this.loadAnnounces()
    });
  }

  loadAnnounces() {
    this.announces = []
    let search:any = this.search === undefined || this.search.length > 2
    if (search) {
      this.search = this.search || ""
      this.loading = true
      this.announceService.listAllAnnounces(this.limit, this.page, this.search).then(res => {
        this.pages = res.pages
        this.announces = res.announces.map(a => {
          a.descLigne = a.desc.replace(/\\n/g, ' ')
          a.pctFunded = this.crowdfundingService.getFundingAmount(a)
          return a
        })
        this.loading = false
        // Redirection éventuelle si la page est incorrecte relativement aux pages disponibles
        if (this.page > this.pages) {
          this.newSearch(this.pages, this.limit, this.search)
        }
      })
    }
  }

  prevPage() {
    this.newSearch(this.page - 1, this.limit, this.search)
  }

  nextPage() {
    this.newSearch(this.page + 1, this.limit, this.search)
  }

  updatePage() {
    this.newSearch(this.page, this.limit, this.search)
  }

  onInput() {
    this.newSearch(this.page, this.limit, this.search)
  }

  onCancel() {
    this.searchEnabled = false
    this.newSearch(this.page, this.limit, this.search)
  }

  enableSearchBar() {
    this.searchEnabled = true
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 1);
  }

  newSearch(page, limit, search) {
    const queryParams:any = { page, limit }
    if (this.searchEnabled) {
      queryParams.search = search
    }
    this.router.navigate(['/'],{ queryParams })
  }
}
