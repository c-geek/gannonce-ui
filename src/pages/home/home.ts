import {Component, OnInit} from "@angular/core";
import {AnnounceService} from "../../services/announce-service";
import {CrowdfundingService} from "../../services/crowdfunding-service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'home',
  template: require('../../app/topbar.html') + require('./home.html')
})
export class HomePage implements OnInit {

  limits:any = [10, 20, 50, 100]
  limit:Number = 10
  page:any = 1
  pages:any = 1
  titre:string = "Toutes les annonces"
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
      this.loadAnnounces()
    });
  }

  loadAnnounces() {
    this.announces = []
    this.announceService.listAllAnnounces(this.limit, this.page).then(res => {
      this.pages = res.pages
      this.announces = res.announces.map(a => {
        a.descLigne = a.desc.replace(/\\n/g, ' ')
        a.pctFunded = this.crowdfundingService.getFundingAmount(a)
        return a
      })
      // Redirection éventuelle si la page est incorrecte relativement aux pages disponibles
      if (this.page > this.pages) {
        this.router.navigate(['/'],{ queryParams: { page: this.pages, limit: this.limit }})
      }
    })
  }

  prevPage() {
    this.router.navigate(['/'],{ queryParams: { page: this.page - 1, limit: this.limit }})
  }

  nextPage() {
    this.router.navigate(['/'],{ queryParams: { page: this.page + 1, limit: this.limit }})
  }

  updatePage() {
    this.router.navigate(['/'],{ queryParams: { page: this.page, limit: this.limit }})
  }
}
