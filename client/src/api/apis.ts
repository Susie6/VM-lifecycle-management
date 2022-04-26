interface UrlDict {
  [key: string]: string;
}

export const Urls: UrlDict = {
  StaticProfile: 'http://127.0.0.1:8000/staticProfile',
  ApplyResource: 'http://127.0.0.1:8000/applyResource',
  DestroyResource: 'http://127.0.0.1:8000/destroyResource',
  ShowSingleResource: 'http://127.0.0.1:8000/showSingleResource',
  UpdateInstanceInfo: 'http://127.0.0.1:8000/updateInstanceInfo',
  ShowResourceInfo: 'http://127.0.0.1:8000/showResourceInfo',
};