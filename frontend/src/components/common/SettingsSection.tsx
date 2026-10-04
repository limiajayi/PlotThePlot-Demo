import styles from "../../styles/SettingsPage.module.css";

type SettingsSectionProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    danger?: boolean;
};

const SettingsSection = ({
    title,
    description,
    children,
    danger = false,
}: SettingsSectionProps) => {
    return (
        <section className={danger ? styles.dangerSection : styles.section}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            {description && (
                <p className={styles.sectionDescripition}>{description}</p>
            )}
            <div className={styles.sectionContent}>{children}</div>
        </section>
    );
};

export default SettingsSection;
