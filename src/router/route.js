
import Discover from '../views/Discover/index.vue'
import Album from '../views/Discover/Album/index.vue'
import Artist from '../views/Discover/Artist/index.vue'
import Djradio from '../views/Discover/Djradio/index.vue'
import PlayList from '../views/Discover/PlayList/index.vue'
import Recommend from '../views/Discover/Recommend/index.vue'
import TopList from '../views/Discover/TopList/index.vue'
import Friend from '../views/Friend/index.vue'
import Login from '../views/Login/index.vue'
import MyHome from '../views/Musician/index.vue'
import My from '../views/my/index.vue'
import Search from '../views/Search/index.vue'
import PlayListDetails from '../views/Discover/PlayList/PlayListDetail.vue'
import MyLikeMusicList from '../views/my/myLikeMusicList.vue'
import MyCollectLists from '../views/my/MyCollectLists.vue'
import ArtistDetail from '../views/ArtistDetail/index.vue'
import Artists from '../views/Discover/Artist/Artists.vue'
import MyLikeArtist from '../views/my/myLikeArtist.vue'

export default [
  { path: '/', redirect: '/discover/recommend', component: Discover},
  { path: '/discover', redirect: "/discover/recommend", component: Discover, children: [
    { path: 'album', component: Album },
    { path: 'artist', component: Artist },
    { path: 'djradio', component: Djradio },
    { path: 'playlist', component: PlayList},
    { path: 'recommend', component: Recommend },
    { path: 'toplist', component: TopList },
  ] },
  { path: '/playlistdetails', component: PlayListDetails },
  { path: '/friend', component: Friend },
  { path: '/myhome', component: MyHome },
  { path: '/my', redirect: '/my/mylikemusiclist', component: My, children: [
    { path: 'mylikemusiclist', component: MyLikeMusicList},
    { path: 'mycollectlists', component: MyCollectLists},
    { path: 'mylikeartist', component: MyLikeArtist},
  ] },
  { path: '/login', component: Login },
  { path: '/search/:searchname', component: Search},
  { path: '/artists/:name', component: Artists},
  { path: '/artistdetail/:id', component: ArtistDetail},
]
