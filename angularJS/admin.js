/**
 * Created by nantian on 2017/3/20.
 */
function config() {
    queue[insertMethod || 'push']([provider, method, arguments]);
    return moduleInstance;
}
function factory() {
    queue[insertMethod || 'push']([provider, method, arguments]);
    return moduleInstance;
}
function requires() {
    queue[insertMethod || 'push']([provider, method, arguments]);
    return moduleInstance;
}