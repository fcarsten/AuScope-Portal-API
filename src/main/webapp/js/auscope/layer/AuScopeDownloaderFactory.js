/**
 * A factory class for creating instances of portal.layer.downloader.Downloader
 */
Ext.define('auscope.layer.AuScopeDownloaderFactory', {

    extend : 'portal.layer.downloader.DownloaderFactory',


    _generateDownloader : function(wfsResources, wmsResources, wcsResources,useDownloadTracker) {
        if (wfsResources.length > 0 && useDownloadTracker) {
            return Ext.create('portal.layer.downloader.wfs.KLWFSDownloader', {map : this.map, featureCountUrl: 'getFeatureCount.do', enableFeatureCounts: true, enableFormatSelection: true});
        }

        if (wfsResources.length > 0 && !useDownloadTracker) {
            return Ext.create('portal.layer.downloader.wfs.WFSDownloader', {map : this.map});
        }

        if (wcsResources.length > 0) {
            return Ext.create('portal.layer.downloader.coverage.WCSDownloader', {map : this.map});
        }

        if (wmsResources.length > 0) {
            return Ext.create('portal.layer.downloader.wms.WMSDownloader', {map : this.map});
        }

        //Not having a downloader isn't a problem.
        return null;
    },

    /**
     * See parent class for defn
     */
    buildFromKnownLayer : function(knownLayer) {
        var allOnlineResources = knownLayer.getAllOnlineResources();

        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WMS);
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS);
        var wcsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WCS);

        return this._generateDownloader(wfsResources, wmsResources, wcsResources,true);
    },

    /**
     * See parent class for defn
     */
    buildFromCswRecord : function(cswRecord) {
        var allOnlineResources = cswRecord.get('onlineResources');

        var wmsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WMS);
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WFS);
        var wcsResources = portal.csw.OnlineResource.getFilteredFromArray(allOnlineResources, portal.csw.OnlineResource.WCS);

        return this._generateDownloader(wfsResources, wmsResources, wcsResources,false);
    }
});