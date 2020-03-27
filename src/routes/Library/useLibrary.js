const React = require('react');
const { useModelState } = require('stremio/common');

const DEFAULT_SORT = 'lastwatched';

const initLibraryState = () => ({
    selected: null,
    type_names: [],
    lib_items: []
});

const mapLibraryState = (library) => {
    const selected = library.selected;
    const type_names = library.type_names;
    const lib_items = library.lib_items.map((lib_item) => ({
        id: lib_item._id,
        type: lib_item.type,
        name: lib_item.name,
        poster: lib_item.poster,
        posterShape: lib_item.posterShape,
        progress: lib_item.state.timeOffset > 0 && lib_item.state.duration > 0 ?
            lib_item.state.timeOffset / lib_item.state.duration
            :
            null,
        videoId: lib_item.state.video_id,
        href: `#/metadetails/${encodeURIComponent(lib_item.type)}/${encodeURIComponent(lib_item._id)}${lib_item.state.video_id !== null ? `/${encodeURIComponent(lib_item.state.video_id)}` : ''}`
    }));
    return { selected, type_names, lib_items };
};

const onNewLibraryState = (library) => {
    if (library.selected === null) {
        return {
            action: 'Load',
            args: {
                model: 'LibraryWithFilters',
                args: {
                    type_name: null,
                    sort: DEFAULT_SORT,
                    continue_watching: false
                }
            }
        };
    } else {
        return null;
    }
};

const useLibrary = (urlParams, queryParams) => {
    const loadLibraryAction = React.useMemo(() => {
        return {
            action: 'Load',
            args: {
                model: 'LibraryWithFilters',
                args: {
                    type_name: typeof urlParams.type === 'string' ? urlParams.type : null,
                    sort: queryParams.has('sort') ? queryParams.get('sort') : DEFAULT_SORT,
                    continue_watching: queryParams.get('cw') === '1'
                }
            }
        };
    }, [urlParams, queryParams]);
    return useModelState({
        model: 'library',
        action: loadLibraryAction,
        map: mapLibraryState,
        init: initLibraryState,
        onNewState: onNewLibraryState
    });
};

module.exports = useLibrary;
