import {
    SvgIconsMasterData,
    SvgIconsTransactions,
    SvgIconsSettings,
    SvgIconsReports,
    SvgIconsSave,
    SvgIconsList,
    SvgIconsCreate
} from './SvgIcons.jsx'
export function SelectSvgIcon(props) {
    return (
        <>
            {props.name === 'MasterData' && (
                <SvgIconsMasterData />
            )}

            {props.name === 'Transactions' && (
                <SvgIconsTransactions />
            )}

            {props.name === 'Reports' && (
                <SvgIconsReports />
            )}

            {props.name === 'Settings' && (
                <SvgIconsSettings />
            )}

            {props.name === 'Save' && (
                <SvgIconsSave />
            )}

            {props.name === 'List' && (
                <SvgIconsList />
            )}

            {props.name === 'Create' && (
                <SvgIconsCreate />
            )}
        </>
    )
}
